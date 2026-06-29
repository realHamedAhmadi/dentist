import {useTranslation} from "react-i18next";
import ResponsiveTextField from "@/shared/components/ui/primitives/Input/ResponsiveTextField";
import ResponsiveRadioGroup from "@/shared/components/ui/primitives/Input/ResponsiveRadioGroup";
import ResponsiveCheckbox from "@/shared/components/ui/primitives/Input/ResponsiveCheckbox";
import DatePicker from "@/shared/components/ui/primitives/Input/DatePicker";
import BloodGroupChips from "@/shared/components/BloodGroup/BloodGroupChips";
import EnterpriseSelect from "@/shared/components/ui/Select/EnterpriseSelect";
import {useState} from "react";
import {IdentifierField} from "@/shared/components/Verifier/IdentifierField";
import {Box, Grid} from "@mui/material";
import {VerificationContainer} from "@/shared/components/Verifier/VerificationContainer";
import Button from "@/shared/components/ui/primitives/Button/Button";

export default function createPage() {
    const [phone, setPhone] = useState("");
    const [sending, setSending] = useState(false);
    const [verifiedIdentifier, setVerifiedIdentifier] = useState<string[]>([]);
    const [otpVisible, setOtpVisible] = useState(false);
    const isVerified = verifiedIdentifier.includes(phone);

    async function handleSendCode() {
        setSending(true);
        //await fakeSend(identifier); // API call
        setSending(false);
        setOtpVisible(true);
    }

    async function handleVerify(code: string) {
        const ok = true //await fakeVerify(identifier, code);
        if (ok) setVerifiedIdentifier(prev => [...prev, phone]);
        setOtpVisible(false);
        return ok;
    }

    const gridSize = {xs: 12, sm: 6, md: 4, lg: 3};
    const gridSize_ = gridSize;
    const doubleGridSize = {xs: 12, sm: 12, md: 6, lg: 6}
    const {t: tAdmin} = useTranslation('admin', {keyPrefix: 'clients.form'})
    const {t: tCommon} = useTranslation('common')
    const TextField = ({name, label, type = 'text', gridSize = gridSize_, otherProps = {}}) => {
        return <ResponsiveTextField
            gridSize={gridSize}
            name={name}
            type={type}
            label={label}
            {...otherProps}
        />
    }
    return (
        <Grid container rowSpacing={2} columnSpacing={1}>
            <TextField
                name='reference_file_number'
                type='number'
                label={tAdmin('fields.referenceFileNumber')}
            />
            <TextField
                name='physical_file_number'
                label={tAdmin('fields.physicalFileNumber')}
            />
            <TextField
                name='first_name'
                label={tCommon('form.fields.firstName')}
            />
            <TextField
                name='last_name'
                label={tCommon('form.fields.lastName')}
            />
            <TextField
                name='father_name'
                label={tAdmin('fields.fatherName')}
            />
            <TextField
                name='national_code'
                label={tCommon('form.fields.nationalCode')}
            />
            <IdentifierField
                gridSize={gridSize}
                name='phone'
                type='tel'
                label={tCommon('form.fields.phone')}
                identifier={phone}
                isSending={sending}
                isVerified={isVerified}
                onSendCode={handleSendCode}
                onChange={setPhone}
            />
            <TextField
                name='tel'
                type='tel'
                label={tCommon('form.fields.tel')}
            />
            <VerificationContainer
                visible={otpVisible}
                onClose={() => setOtpVisible(false)}
                onVerify={handleVerify}
                onResend={() => true}
            />
            <DatePicker
                gridSize={gridSize}
                name='birth_date'
                label={tCommon('form.fields.birthDate')}
                openTo='year'
            />
            <ResponsiveRadioGroup
                gridSize={gridSize}
                name='gender'
                label={tCommon('form.fields.gender')}
                radios={[
                    {label: tCommon('form.fields.male'), value: 'male'},
                    {label: tCommon('form.fields.female'), value: 'female'}
                ]}
                horizontal
            />
            <ResponsiveRadioGroup
                gridSize={gridSize}
                name='is_married'
                label={tAdmin('fields.married')}
                radios={[
                    {label: tCommon('form.fields.single'), value: '0'},
                    {label: tCommon('form.fields.married'), value: '1'}
                ]}
                horizontal
            />
            <ResponsiveCheckbox
                gridSize={gridSize}
                name='is_pregnant'
                label={tAdmin('fields.pregnant')}
            />
            <EnterpriseSelect
                label={tAdmin('fields.education')}
                gridSize={gridSize}
                name='education_id'
                onChange={() => {
                }}
                options={[]}/>
            <TextField
                gridSize={gridSize}
                name='job'
                label={tAdmin('fields.job')}
            />
            <BloodGroupChips
                gridSize={doubleGridSize}
                name='blood_group_id'
                label={tCommon('form.fields.bloodGroup')}
            />
            <EnterpriseSelect
                label={tAdmin('fields.systemicDisease')}
                gridSize={doubleGridSize}
                name='systemic_disease_id'
                onChange={() => {
                }}
                options={[]}/>
            <TextField
                label={tAdmin('fields.diseaseDescription')}
                gridSize={doubleGridSize}
                name='disease_description'
                otherProps={{multiline: true}}
            />
            <TextField
                label={tAdmin('fields.notes')}
                gridSize={doubleGridSize}
                name='notes'
                otherProps={{multiline: true}}
            />
            <TextField
                label={tAdmin('fields.address')}
                gridSize={doubleGridSize}
                name='address'
                otherProps={{multiline: true}}
            />
            <TextField
                label={tCommon('form.fields.password')}
                gridSize={gridSize}
                name='password'
                type='password'
            />
            <TextField
                label={tCommon('form.fields.passwordConfirmation')}
                gridSize={gridSize}
                name='password_confirmation'
                type='password'
            />
            <Grid item container size={{xs:12}}>
                <Button>{tCommon('actions.submit')}</Button>
                <Button color='secondary'>{tAdmin('fields.redirect')}</Button>
            </Grid>
        </Grid>
    )
}
