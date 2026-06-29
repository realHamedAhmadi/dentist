<?php

namespace Modules\Verification\Enums;

enum VerificationStatus:string {

    case SENT='sent'; // Code sent

    case BLOCKED='blocked';

    case VERIFIED='verified';
}
