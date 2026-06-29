<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => ':attribute باید پذیرفته شده باشد.',
    'active_url' => 'آدرس :attribute معتبر نیست.',
    'after' => ':attribute باید تاریخی بعد از :date باشد.',
    'after_or_equal' => ':attribute باید تاریخی بعد از :date، یا مطابق با آن باشد.',
    'alpha' => ':attribute باید فقط حروف الفبا باشد.',
    'alpha_dash' => ':attribute باید فقط حروف الفبا، اعداد، خط تیره و زیرخط باشد.',
    'alpha_num' => ':attribute باید فقط حروف الفبا و اعداد باشد.',
    'array' => ':attribute باید آرایه باشد.',
    'before' => ':attribute باید تاریخی قبل از :date باشد.',
    'before_or_equal' => ':attribute باید تاریخی قبل از :date، یا مطابق با آن باشد.',
    'between' => [
        'numeric' => ':attribute باید بین :min و :max باشد.',
        'file' => ':attribute باید بین :min و :max کیلوبایت باشد.',
        'string' => ':attribute باید بین :min و :max کاراکتر باشد.',
        'array' => ':attribute باید بین :min و :max آیتم باشد.',
    ],
    'boolean' => 'فیلد :attribute فقط می‌تواند true و یا false باشد.',
    'confirmed' => ':attribute با فیلد تکرار مطابقت ندارد.',
    'date' => ':attribute یک تاریخ معتبر نیست.',
    'date_equals' => ':attribute باید یک تاریخ برابر با تاریخ :date باشد.',
    'date_format' => ':attribute با الگوی :format مطابقت ندارد.',
    'different' => ':attribute و :other باید از یکدیگر متفاوت باشند.',
    'digits' => ':attribute باید :digits رقم باشد.',
    'digits_between' => ':attribute باید بین :min و :max رقم باشد.',
    'dimensions' => 'ابعاد تصویر :attribute قابل قبول نیست.',
    'distinct' => 'فیلد :attribute مقدار تکراری دارد.',
    'email' => ':attribute باید یک ایمیل معتبر باشد.',
    'ends_with' => 'فیلد :attribute باید با یکی از مقادیر زیر خاتمه یابد: :values',
    'exists' => ':attribute انتخاب شده، معتبر نیست.',
    'file' => ':attribute باید یک فایل معتبر باشد.',
    'filled' => 'فیلد :attribute باید مقدار داشته باشد.',
    'gt' => [
        'numeric' => ':attribute باید بزرگتر از :value باشد.',
        'file' => ':attribute باید بزرگتر از :value کیلوبایت باشد.',
        'string' => ':attribute باید بیشتر از :value کاراکتر داشته باشد.',
        'array' => ':attribute باید بیشتر از :value آیتم داشته باشد.',
    ],
    'gte' => [
        'numeric' => ':attribute باید بزرگتر یا مساوی :value باشد.',
        'file' => ':attribute باید بزرگتر یا مساوی :value کیلوبایت باشد.',
        'string' => ':attribute باید بیشتر یا مساوی :value کاراکتر داشته باشد.',
        'array' => ':attribute باید بیشتر یا مساوی :value آیتم داشته باشد.',
    ],
    'image' => ':attribute باید یک تصویر معتبر باشد.',
    'in' => ':attribute انتخاب شده، معتبر نیست.',
    'in_array' => 'فیلد :attribute در لیست :other وجود ندارد.',
    'integer' => ':attribute باید عدد صحیح باشد.',
    'ip' => ':attribute باید آدرس IP معتبر باشد.',
    'ipv4' => ':attribute باید یک آدرس معتبر از نوع IPv4 باشد.',
    'ipv6' => ':attribute باید یک آدرس معتبر از نوع IPv6 باشد.',
    'json' => 'فیلد :attribute باید یک رشته از نوع JSON باشد.',
    'lt' => [
        'numeric' => ':attribute باید کوچکتر از :value باشد.',
        'file' => ':attribute باید کوچکتر از :value کیلوبایت باشد.',
        'string' => ':attribute باید کمتر از :value کاراکتر داشته باشد.',
        'array' => ':attribute باید کمتر از :value آیتم داشته باشد.',
    ],
    'lte' => [
        'numeric' => ':attribute باید کوچکتر یا مساوی :value باشد.',
        'file' => ':attribute باید کوچکتر یا مساوی :value کیلوبایت باشد.',
        'string' => ':attribute باید کمتر یا مساوی :value کاراکتر داشته باشد.',
        'array' => ':attribute باید کمتر یا مساوی :value آیتم داشته باشد.',
    ],
    'max' => [
        'numeric' => ':attribute نباید بزرگتر از :max باشد.',
        'file' => ':attribute نباید بزرگتر از :max کیلوبایت باشد.',
        'string' => ':attribute نباید بیشتر از :max کاراکتر داشته باشد.',
        'array' => ':attribute نباید بیشتر از :max آیتم داشته باشد.',
    ],
    'mimes' => 'فرمت‌های معتبر فایل عبارتند از: :values.',
    'mimetypes' => 'فرمت‌های معتبر فایل عبارتند از: :values.',
    'min' => [
        'numeric' => ':attribute نباید کوچکتر از :min باشد.',
        'file' => ':attribute نباید کوچکتر از :min کیلوبایت باشد.',
        'string' => ':attribute نباید کمتر از :min کاراکتر داشته باشد.',
        'array' => ':attribute نباید کمتر از :min آیتم داشته باشد.',
    ],
    'not_in' => ':attribute انتخاب شده، معتبر نیست.',
    'not_regex' => 'فرمت :attribute معتبر نیست.',
    'numeric' => ':attribute باید عدد یا رشته‌ای از اعداد باشد.',
    'present' => 'فیلد :attribute باید در پارامترهای ارسالی وجود داشته باشد.',
    'regex' => 'فرمت :attribute معتبر نیست.',
    'required' => 'فیلد :attribute الزامی است.',
    'required_if' => 'فیلد :attribute الزامی است.',
    //'required_if' => 'هنگامی که :other برابر با :value است، فیلد :attribute الزامی است.',
    'required_unless' => 'فیلد :attribute الزامی است، مگر آنکه :other در :values موجود باشد.',
    'required_with' => 'در صورت وجود فیلد :values، فیلد :attribute نیز الزامی است.',
    'required_with_all' => 'در صورت وجود فیلدهای :values، فیلد :attribute نیز الزامی است.',
    'required_without' => 'در صورت عدم وجود فیلد :values، فیلد :attribute الزامی است.',
    'required_without_all' => 'در صورت عدم وجود هر یک از فیلدهای :values، فیلد :attribute الزامی است.',
    'same' => ':attribute و :other باید همانند هم باشند.',
    'size' => [
        'numeric' => ':attribute باید برابر با :size باشد.',
        'file' => ':attribute باید برابر با :size کیلوبایت باشد.',
        'string' => ':attribute باید برابر با :size کاراکتر باشد.',
        'array' => ':attribute باید شامل :size آیتم باشد.',
    ],
    'starts_with' => ':attribute باید با یکی از این ها شروع شود: :values',
    'string' => 'فیلد :attribute باید رشته باشد.',
    'timezone' => 'فیلد :attribute باید یک منطقه زمانی معتبر باشد.',
    'unique' => ':attribute قبلا انتخاب شده است.',
    'uploaded' => 'بارگذاری فایل :attribute موفقیت آمیز نبود.',
    'url' => ':attribute معتبر نمی‌باشد.',
    'uuid' => ':attribute باید یک UUID معتبر باشد.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [
        'name' => 'نام',
        'username' => 'نام کاربری',
        'email' => 'ایمیل',
        'first_name' => 'نام',
        'last_name' => 'نام خانوادگی',
        'password' => 'گذرواژه',
        'password_confirmation' => 'تکرار گذرواژه',
        'city' => 'شهر',
        'country' => 'کشور',
        'address' => 'نشانی',
        'phone' => 'شماره ثابت',
        'mobile' => 'شماره همراه',
        'Mobile' => 'شماره همراه',
        'age' => 'سن',
        'sex' => 'جنسیت',
        'gender' => 'جنسیت',
        'day' => 'روز',
        'month' => 'ماه',
        'year' => 'سال',
        'hour' => 'ساعت',
        'minute' => 'دقیقه',
        'second' => 'ثانیه',
        'title' => 'عنوان',
        'text' => 'متن',
        'content' => 'محتوا',
        'description' => 'توضیحات',
        'excerpt' => 'گزیده مطلب',
        'date' => 'تاریخ',
        'time' => 'زمان',
        'available' => 'موجود',
        'size' => 'اندازه',
        'terms' => 'شرایط',
        'province' => 'استان',
        'keywords' => 'کلمات کلیدی',
        'link' => ' ادرس ',
        'alt' => ' متن جایگزین ',
        'register_email' => ' ایمیل  ',
        'register_username' => ' نام کاربری ',
        'register_password' => ' رمز عبور ',
        're_password' => '  تاییده رمز عبور ',
        'login_username' => '   نام کاربری  ',
        'login_password' => '  رمز عبور ',

        'image_file_preOrder' => ' عکس ',


        'login' => ' نام کاربری یا ایمیل ',
        ///////////////
        'client_id'=>'بیمار',
        'lab_id'=>'لابراتوار',
        'assistant_id'=>'دستیار',
        'courier_id'=>'پیک',
        'bank_account_id'=>'حساب بانکی',
        'absence_start_date'=>'تاریخ شروع مرخصی',
        'absence_end_date'=>'تاریخ پایان مرخصی',
        'started_at'=>'تاریخ شروع',
        'expires_at'=>'تاریخ اعتبار',
        'insurance_id'=>'بیمه',
        'percent'=>'درصد',
        'insurance.*.percent'=>'درصد فرانشیز بیمه',
        'max_amount'=>'سقف مبلغ',
        'insurance.*.max_amount'=>'سقف مبلغ',
        'insurance.*.started'=>'تاریخ شروع قرارداد بیمه',
        'insurance.*.expires'=>'تاریخ اعتبار بیمه',
        'insurance_receipt_status'=>'وضعیت وصول',
        'insurance_receipt_date'=>'تاریخ وصول',
        'number1'=>'شماره موبایل',
        'national_code'=>'کد ملی',
        'medical_code'=>'کد نظام پزشکی',
        'birth_day'=>'تاریخ تولد',
        'user_notes'=>'یادداشت کاربر',
        'position' => 'سمت',
        'teeth' => 'دندان',
        'price' => 'هزینه',
        'position_id' => 'تخصص',
        'expert_id' => 'متخصص',
        'positions.*.position' => 'جایگاه',
        'service_id' => 'نوع خدمت',
        'user_id' => 'کاربر',
        'times' => 'زمان حضور',
        'start_date' => 'تاریخ شروع',
        'master_id' => 'مربی',
        'total' => 'تعداد جلسات',
        'career_id' => 'حرفه ورزشی',
        'phone_number' => 'شماره همراه',
        'price_per_session' => 'هزینه هر جلسه',
        'price_per_additional_person' => 'مبلغ به ازای هر نفر اضافی',
        'ppap' => 'مبلغ به ازای هر نفر اضافی',
        'discount_percent' => 'درصد تخفیف',
        'discount' => 'تخفیف',
        'number_of_persons' => 'تعداد افراد',
        "birthday" => "تاریخ تولد",
        "verify_mobile" => "کد تایید",
        "cancel_time" => "زمان کلاس",
        "reagent_code" => "کد معرف",
        "avatar" => "عکس پروفایل",
        "is_group" => "گروه",
        "birth_date" => 'تاریخ تولد',
        "city_id" => 'شهر',
        "province_code" => 'استان',
        "postal_code" => 'کد پستی',
        ///////////////////
        'amount' => 'مبلغ',
        'd' => 'مبلغ واریزی',
        "choice" => 'انتخاب محصول',
        'deposit' => 'مبلغ واریزی',
        ////////////////////
        'share_type'=>'نوع سهم',
        'share_value'=>'مقدار سهم',
        'specialties'=>'تخصص',
        'specialties.*.id'=>'نوع تخصص',
        'specialties.*.share_type'=>'نوع سهم',
        'specialties.*.share_value'=>'مقدار سهم',
        'expert_weekly_schedules'=>'برنامه حضور هفتگی پزشک',
        'expert_weekly_schedules.*.day'=>'روز',
        'expert_weekly_schedules.*.starts_at'=>'ساعت شروع',
        'expert_weekly_schedules.*.ends_at'=>'ساعت پایانی',
        'shift_id'=>'شیفت کاری',
        'contract_type_id'=>'نوع قرارداد',
        'is_active'=>'وضعیت فعال',
        'hire_date'=>'تاریخ استخدام',
        'end_date'=>'تاریخ پایان',
        'employee_code'=>'کد پرسنلی',
        'license_number'=>'شماره نظام پزشکی',
        'roles'=>'نقش ها',
        'start_time'=>'ساعت شروع',
        'end_time'=>'ساعت پایان',
        'code'=>'کد',
    ],
];
