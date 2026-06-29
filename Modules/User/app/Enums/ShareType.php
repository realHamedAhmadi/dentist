<?php
namespace Modules\User\Enums;

use Modules\Core\Traits\EnumToArray;

enum ShareType:string{
    use EnumToArray;

    case FIXED='fixed';
    case PERCENTAGE='percentage';
}
