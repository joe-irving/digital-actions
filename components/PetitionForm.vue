<script setup lang="ts">
import type { FormValidationError, FormRules, FormItemRule, FormInst } from 'naive-ui'
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'

type RouterOutput = inferRouterOutputs<AppRouter>;

type CustomFields = RouterOutput['petition']['getPublic']['customFields'];

const i18n = useI18n()
const countries = useGetCountryList()

const route = useRoute()
const sourceCode = route.query.source?.toString() || route.query.utm_source?.toString() || route.query.source_code?.toString() || null

const emit = defineEmits(['success'])

const countryOptions = ref(countries.map((c) => { return { label: c.name, value: c.iso2 } }))

const props = defineProps({
  endpoint: {
    type: String,
    default: ''
  },
  pcEndpoint: {
    type: String,
    default: ''
  },
  tagName: {
    type: String,
    default: ''
  },
  tagPrefix: {
    type: String,
    default: ''
  },
  groupName: {
    type: String,
    default: ''
  },
  tagList: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  customFields: {
    type: Array as PropType<CustomFields>,
    default: () => []
  }
})

const submission = ref<{
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  comments: string,
  postalCode: string,
  country: string | null,
  optIn: boolean | null,
  customFields: {[key: string]: string}
}>({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  comments: '',
  postalCode: '',
  country: null,
  optIn: null,
  customFields: {}
})

const formWarningMessages = ref<FormValidationError[]>([])

const formRules = ref<FormRules>({
  firstName: {
    required: true,
    message: i18n.t('petition_form.first_name_required'),
    trigger: ['blur']
  },
  lastName: {
    required: true,
    message: i18n.t('petition_form.last_name_required'),
    trigger: ['blur']
  },
  email: {
    required: true,
    trigger: ['blur'],
    validator (_rule: FormItemRule, value: string) {
      if (value === '') {
        return true
      } else if (!/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(value)) {
        return new Error(i18n.t('petition_form.email_invalid'))
      }
      return true
    }
  },
  optIn: {
    required: false,
    trigger: ['blur'],
    validator (_rule: FormItemRule, value: boolean | null) {
      if (value === null) {
        return new Error(i18n.t('petition_form.opt_in_required'))
      }
      return true
    }
  }
})

const formRef = ref<FormInst | null>(null)

interface CountryCode {
  iso2: string;
  name: string;
  dialCode: string
}

interface CountryCodeInput {
  country: CountryCode
}
interface CustomFieldSubmission {
  [k: string]: string
}

const countryChanged = (country: CountryCode) => {
  submission.value.country = country.iso2
}

const handleSignPetition = () => {
  formWarningMessages.value = []
  // validate
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      formWarningMessages.value = errors
    } else {
      signPetiton()
    }
  })
}

const signPetiton = async () => {
  const tags = [
    props.tagName,
    ...props.tagList
  ]
  if (!submission.value.optIn) {
    tags.push(`[${props.tagPrefix}] Do not subscribe`)
  }
  let customFields: {
    [key: string]: string
  } = {}
  customFields[`${props.tagPrefix}_petition_title`] = props.title
  customFields[`${props.tagPrefix}_petition_url`] = props.url
  customFields = { ...customFields, ...submission.value.customFields }
  const submissionBody = {
    comments: submission.value.comments,
    person: {
      family_name: submission.value.lastName,
      given_name: submission.value.firstName,
      postal_addresses: [{
        postal_code: submission.value.postalCode,
        country: submission.value.country && submission.value.country.length > 0 ? submission.value.country : undefined
      }],
      email_addresses: [{ address: submission.value.email.length > 0 ? submission.value.email : (self.crypto.randomUUID ? self.crypto.randomUUID() : Math.random() * 10 ** 20).toString() }],
      phone_numbers: [{ number: submission.value.phoneNumber }],
      custom_fields: customFields
    },
    add_tags: tags,
    'action_network:referrer_data': sourceCode
      ? {
          source: sourceCode
        }
      : undefined
  }
  const { error } = await useFetch(props.endpoint, {
    method: 'POST',
    body: submissionBody
  })
  const { error: pcError } = await useFetch(props.pcEndpoint, {
    method: 'POST',
    body: submissionBody
  })
  if (error.value || pcError.value) {
    formWarningMessages.value = [[{
      message: i18n.t('petition_form.error')
    }]]
  } else {
    emit('success')
  }
}
</script>

<template>
  <n-form ref="formRef" :model="submission" :rules="formRules" @submit.prevent="handleSignPetition">
    <n-form-item path="firstName" :label="$t('petition_form.first_name_label')">
      <n-input v-model:value="submission.firstName" placeholder="" />
    </n-form-item>
    <n-form-item path="lastName" :label="$t('petition_form.last_name_label')">
      <n-input v-model:value="submission.lastName" placeholder="" />
    </n-form-item>
    <n-form-item path="email" :label="$t('petition_form.email_label')">
      <n-input v-model:value="submission.email" placeholder="" />
    </n-form-item>
    <n-form-item path="phone" :label="$t('petition_form.phone_label')">
      <client-only>
        <VueTelInput
          v-model="submission.phoneNumber"
          style-classes="n-input"
          :input-options="{placeholder: ''}"
          @country-changed="countryChanged"
          @on-input="(_num: number, input: CountryCodeInput) => countryChanged(input.country)"
        />
      </client-only>
    </n-form-item>
    <n-form-item path="postalCode" :label="$t('petition_form.postal_code')">
      <n-input v-model:value="submission.postalCode" placeholder="" />
    </n-form-item>
    <n-form-item path="country" :label="$t('petition_form.country_label')">
      <n-select v-model:value="submission.country" :options="countryOptions" />
    </n-form-item>
    <PetitionCustomFields :fields="customFields" @update="(fields: CustomFieldSubmission) => submission.customFields = fields" />
    <n-form-item path="optIn">
      <n-radio-group v-model:value="submission.optIn" name="optIn">
        <n-space>
          <n-radio
            :value="true"
            :label="$t('petition_form.opt_in_yes')"
          />
          <n-radio
            :value="false"
            :label="$t('petition_form.opt_in_no')"
          />
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-space justify="center">
      <n-button type="success" size="large" @click.prevent="handleSignPetition">
        {{ $t('petition_form.add_my_name') }}
      </n-button>
    </n-space>
    <div v-if="formWarningMessages.length > 0">
      <FormErrorList :errors="formWarningMessages" />
    </div>
    <Np class="text-xs">
      {{ $t('petition_form.process_info') }} <a href="https://tippingpointuk.org/privacy" target="_blank">{{ $t('petition_form.privacy_policy') }}</a>.
    </Np>
  </n-form>
</template>

<style>
.vti__input{
  background-color: var(--n-color);
}
</style>
