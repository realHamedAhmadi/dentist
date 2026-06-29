<?php

namespace Modules\Verification\Enums;

enum VerificationPurpose: string
{
    case DEFAULT = 'default';

    case LOGIN = 'login';

    case REGISTER = 'register';

    case CHANGE_PHONE = 'change_phone';

    case CHANGE_EMAIL = 'change_email';
}
