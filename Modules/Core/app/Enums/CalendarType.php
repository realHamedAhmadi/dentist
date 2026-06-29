<?php

namespace Modules\Core\Enums;

use Modules\Core\Traits\EnumToArray;

enum CalendarType:string {
    use EnumToArray;

    case GREGORIAN='gregorian';

    case JALALI='jalali';

    case HIJRI='hijri';
}
