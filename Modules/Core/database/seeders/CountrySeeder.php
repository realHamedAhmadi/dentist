<?php

namespace Modules\Core\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('countries')->truncate();

        // جدول کشورها
        DB::table('countries')->insert([
            ['id'=>1,'name'=>'Iran','iso2'=>'IR','iso3'=>'IRN','phone_code'=>'+98','min_phone_length'=>10,'max_phone_length'=>10,'capital'=>'Tehran','continent'=>'Asia'],
            ['id'=>2,'name'=>'Afghanistan','iso2'=>'AF','iso3'=>'AFG','phone_code'=>'+93','min_phone_length'=>9,'max_phone_length'=>9,'capital'=>'Kabul','continent'=>'Asia'],
            ['id'=>3,'name'=>'Armenia','iso2'=>'AM','iso3'=>'ARM','phone_code'=>'+374','min_phone_length'=>8,'max_phone_length'=>8,'capital'=>'Yerevan','continent'=>'Asia'],
            ['id'=>4,'name'=>'Azerbaijan','iso2'=>'AZ','iso3'=>'AZE','phone_code'=>'+994','min_phone_length'=>9,'max_phone_length'=>9,'capital'=>'Baku','continent'=>'Asia'],
            ['id'=>5,'name'=>'Iraq','iso2'=>'IQ','iso3'=>'IRQ','phone_code'=>'+964','min_phone_length'=>10,'max_phone_length'=>10,'capital'=>'Baghdad','continent'=>'Asia'],
            ['id'=>6,'name'=>'Pakistan','iso2'=>'PK','iso3'=>'PAK','phone_code'=>'+92','min_phone_length'=>10,'max_phone_length'=>10,'capital'=>'Islamabad','continent'=>'Asia'],
            ['id'=>7,'name'=>'Turkey','iso2'=>'TR','iso3'=>'TUR','phone_code'=>'+90','min_phone_length'=>10,'max_phone_length'=>10,'capital'=>'Ankara','continent'=>'Asia'],
            ['id'=>8,'name'=>'Turkmenistan','iso2'=>'TM','iso3'=>'TKM','phone_code'=>'+993','min_phone_length'=>8,'max_phone_length'=>8,'capital'=>'Ashgabat','continent'=>'Asia'],
            ['id'=>9,'name'=>'United Arab Emirates','iso2'=>'AE','iso3'=>'ARE','phone_code'=>'+971','min_phone_length'=>9,'max_phone_length'=>9,'capital'=>'Abu Dhabi','continent'=>'Asia'],
            ['id'=>10,'name'=>'Saudi Arabia','iso2'=>'SA','iso3'=>'SAU','phone_code'=>'+966','min_phone_length'=>9,'max_phone_length'=>9,'capital'=>'Riyadh','continent'=>'Asia'],
            ['id'=>11,'name'=>'Qatar','iso2'=>'QA','iso3'=>'QAT','phone_code'=>'+974','min_phone_length'=>8,'max_phone_length'=>8,'capital'=>'Doha','continent'=>'Asia'],
            ['id'=>12,'name'=>'Oman','iso2'=>'OM','iso3'=>'OMN','phone_code'=>'+968','min_phone_length'=>8,'max_phone_length'=>8,'capital'=>'Muscat','continent'=>'Asia'],
            ['id'=>13,'name'=>'Kuwait','iso2'=>'KW','iso3'=>'KWT','phone_code'=>'+965','min_phone_length'=>8,'max_phone_length'=>8,'capital'=>'Kuwait City','continent'=>'Asia'],
            ['id'=>14,'name'=>'Bahrain','iso2'=>'BH','iso3'=>'BHR','phone_code'=>'+973','min_phone_length'=>8,'max_phone_length'=>8,'capital'=>'Manama','continent'=>'Asia'],

            // کشورهای اروپایی
            ['id'=>15,'name'=>'Germany','iso2'=>'DE','iso3'=>'DEU','phone_code'=>'+49','min_phone_length'=>10,'max_phone_length'=>11,'capital'=>'Berlin','continent'=>'Europe'],
            ['id'=>16,'name'=>'France','iso2'=>'FR','iso3'=>'FRA','phone_code'=>'+33','min_phone_length'=>9,'max_phone_length'=>9,'capital'=>'Paris','continent'=>'Europe'],
            ['id'=>17,'name'=>'United Kingdom','iso2'=>'GB','iso3'=>'GBR','phone_code'=>'+44','min_phone_length'=>10,'max_phone_length'=>10,'capital'=>'London','continent'=>'Europe'],
            ['id'=>18,'name'=>'Italy','iso2'=>'IT','iso3'=>'ITA','phone_code'=>'+39','min_phone_length'=>9,'max_phone_length'=>10,'capital'=>'Rome','continent'=>'Europe'],
            ['id'=>19,'name'=>'Spain','iso2'=>'ES','iso3'=>'ESP','phone_code'=>'+34','min_phone_length'=>9,'max_phone_length'=>9,'capital'=>'Madrid','continent'=>'Europe'],
            ['id'=>20,'name'=>'Switzerland','iso2'=>'CH','iso3'=>'CHE','phone_code'=>'+41','min_phone_length'=>9,'max_phone_length'=>9,'capital'=>'Bern','continent'=>'Europe'],
            ['id'=>21,'name'=>'Netherlands','iso2'=>'NL','iso3'=>'NLD','phone_code'=>'+31','min_phone_length'=>9,'max_phone_length'=>9,'capital'=>'Amsterdam','continent'=>'Europe'],
            ['id'=>22,'name'=>'Sweden','iso2'=>'SE','iso3'=>'SWE','phone_code'=>'+46','min_phone_length'=>9,'max_phone_length'=>10,'capital'=>'Stockholm','continent'=>'Europe'],
            ['id'=>23,'name'=>'Norway','iso2'=>'NO','iso3'=>'NOR','phone_code'=>'+47','min_phone_length'=>8,'max_phone_length'=>8,'capital'=>'Oslo','continent'=>'Europe'],
            ['id'=>24,'name'=>'Denmark','iso2'=>'DK','iso3'=>'DNK','phone_code'=>'+45','min_phone_length'=>8,'max_phone_length'=>8,'capital'=>'Copenhagen','continent'=>'Europe'],
            ['id'=>25,'name'=>'Austria','iso2'=>'AT','iso3'=>'AUT','phone_code'=>'+43','min_phone_length'=>10,'max_phone_length'=>11,'capital'=>'Vienna','continent'=>'Europe'],
            ['id'=>26,'name'=>'Belgium','iso2'=>'BE','iso3'=>'BEL','phone_code'=>'+32','min_phone_length'=>8,'max_phone_length'=>9,'capital'=>'Brussels','continent'=>'Europe'],
            ['id'=>27,'name'=>'Poland','iso2'=>'PL','iso3'=>'POL','phone_code'=>'+48','min_phone_length'=>9,'max_phone_length'=>9,'capital'=>'Warsaw','continent'=>'Europe'],
            ['id'=>28,'name'=>'Greece','iso2'=>'GR','iso3'=>'GRC','phone_code'=>'+30','min_phone_length'=>10,'max_phone_length'=>10,'capital'=>'Athens','continent'=>'Europe'],
            ['id'=>29,'name'=>'Portugal','iso2'=>'PT','iso3'=>'PRT','phone_code'=>'+351','min_phone_length'=>9,'max_phone_length'=>9,'capital'=>'Lisbon','continent'=>'Europe'],

            // آمریکای شمالی
            ['id'=>30,'name'=>'United States','iso2'=>'US','iso3'=>'USA','phone_code'=>'+1','min_phone_length'=>10,'max_phone_length'=>10,'capital'=>'Washington, D.C.','continent'=>'North America'],
            ['id'=>31,'name'=>'Canada','iso2'=>'CA','iso3'=>'CAN','phone_code'=>'+1','min_phone_length'=>10,'max_phone_length'=>10,'capital'=>'Ottawa','continent'=>'North America'],
            ['id'=>32,'name'=>'Mexico','iso2'=>'MX','iso3'=>'MEX','phone_code'=>'+52','min_phone_length'=>10,'max_phone_length'=>10,'capital'=>'Mexico City','continent'=>'North America'],
        ]);

        // ارتباط کشور ↔ ارز
        DB::table('country_currency')->truncate();
        DB::table('country_currency')->insert([
            ['country_id'=>1,'currency_id'=>1,'is_primary'=>true], // Iran - IRR
            ['country_id'=>1,'currency_id'=>2,'is_primary'=>false], // Iran - USD
            ['country_id'=>2,'currency_id'=>15,'is_primary'=>true], // Afghanistan - AFN
            ['country_id'=>3,'currency_id'=>16,'is_primary'=>true], // Armenia - AMD ??? باید اصلاح شود
            ['country_id'=>4,'currency_id'=>18,'is_primary'=>true], // Azerbaijan - AZN
            ['country_id'=>5,'currency_id'=>16,'is_primary'=>true], // Iraq - IQD
            ['country_id'=>6,'currency_id'=>17,'is_primary'=>true], // Pakistan - PKR
            ['country_id'=>7,'currency_id'=>4,'is_primary'=>true], // Turkey - TRY
            ['country_id'=>8,'currency_id'=>18,'is_primary'=>true], // Turkmenistan - TMT ?? (فرضی)
            ['country_id'=>9,'currency_id'=>8,'is_primary'=>true], // UAE - AED
            ['country_id'=>10,'currency_id'=>7,'is_primary'=>true], // Saudi - SAR
            ['country_id'=>11,'currency_id'=>11,'is_primary'=>true], // Qatar - QAR
            ['country_id'=>12,'currency_id'=>12,'is_primary'=>true], // Oman - OMR
            ['country_id'=>13,'currency_id'=>14,'is_primary'=>true], // Kuwait - KWD
            ['country_id'=>14,'currency_id'=>13,'is_primary'=>true], // Bahrain - BHD

            ['country_id'=>15,'currency_id'=>3,'is_primary'=>true], // Germany - EUR
            ['country_id'=>16,'currency_id'=>3,'is_primary'=>true], // France - EUR
            ['country_id'=>17,'currency_id'=>5,'is_primary'=>true], // UK - GBP
            ['country_id'=>18,'currency_id'=>3,'is_primary'=>true], // Italy - EUR
            ['country_id'=>19,'currency_id'=>3,'is_primary'=>true], // Spain - EUR
            ['country_id'=>20,'currency_id'=>10,'is_primary'=>true], // Switzerland - CHF
            ['country_id'=>21,'currency_id'=>3,'is_primary'=>true], // Netherlands - EUR
            ['country_id'=>22,'currency_id'=>3,'is_primary'=>true], // Sweden - EUR
            ['country_id'=>23,'currency_id'=>3,'is_primary'=>true], // Norway - EUR
            ['country_id'=>24,'currency_id'=>3,'is_primary'=>true], // Denmark - EUR
            ['country_id'=>25,'currency_id'=>3,'is_primary'=>true], // Austria - EUR
            ['country_id'=>26,'currency_id'=>3,'is_primary'=>true], // Belgium - EUR
            ['country_id'=>27,'currency_id'=>3,'is_primary'=>true], // Poland - EUR
            ['country_id'=>28,'currency_id'=>3,'is_primary'=>true], // Greece - EUR
            ['country_id'=>29,'currency_id'=>3,'is_primary'=>true], // Portugal - EUR

            ['country_id'=>30,'currency_id'=>2,'is_primary'=>true], // US - USD
            ['country_id'=>31,'currency_id'=>6,'is_primary'=>true], // Canada - CAD
            ['country_id'=>32,'currency_id'=>2,'is_primary'=>true], // Mexico - USD
        ]);

        // ارتباط کشور ↔ زبان
        DB::table('country_language')->truncate();
        DB::table('country_language')->insert([
                // ایران و همسایگان
                ['country_id'=>1,'language_id'=>1],  // Iran - Persian
                ['country_id'=>2,'language_id'=>2],  // Afghanistan - Dari
                ['country_id'=>2,'language_id'=>3],  // Afghanistan - Pashto
                ['country_id'=>2,'language_id'=>22], // Afghanistan - Farsi (Afghanistan)
                ['country_id'=>3,'language_id'=>19], // Armenia - Armenian
                ['country_id'=>4,'language_id'=>20], // Azerbaijan - Azerbaijani
                ['country_id'=>5,'language_id'=>6],  // Iraq - Arabic
                ['country_id'=>5,'language_id'=>7],  // Iraq - Kurdish
                ['country_id'=>6,'language_id'=>4],  // Pakistan - Urdu
                ['country_id'=>6,'language_id'=>5],  // Pakistan - English
                ['country_id'=>7,'language_id'=>8],  // Turkey - Turkish
                ['country_id'=>8,'language_id'=>21], // Turkmenistan - Turkmen
                ['country_id'=>9,'language_id'=>6],  // UAE - Arabic
                ['country_id'=>10,'language_id'=>6], // Saudi Arabia - Arabic
                ['country_id'=>11,'language_id'=>6], // Qatar - Arabic
                ['country_id'=>12,'language_id'=>6], // Oman - Arabic
                ['country_id'=>13,'language_id'=>6], // Kuwait - Arabic
                ['country_id'=>14,'language_id'=>6], // Bahrain - Arabic

                // اروپای مهم
                ['country_id'=>15,'language_id'=>9],  // Germany - German
                ['country_id'=>16,'language_id'=>10], // France - French
                ['country_id'=>17,'language_id'=>5],  // United Kingdom - English
                ['country_id'=>18,'language_id'=>11], // Italy - Italian
                ['country_id'=>19,'language_id'=>12], // Spain - Spanish
                ['country_id'=>20,'language_id'=>9],  // Switzerland - German
                ['country_id'=>20,'language_id'=>10], // Switzerland - French
                ['country_id'=>20,'language_id'=>11], // Switzerland - Italian
                ['country_id'=>21,'language_id'=>13], // Netherlands - Dutch
                ['country_id'=>22,'language_id'=>14], // Sweden - Swedish
                ['country_id'=>23,'language_id'=>15], // Norway - Norwegian
                ['country_id'=>24,'language_id'=>14], // Denmark - Swedish? (یا Danish اضافه شود)
                ['country_id'=>25,'language_id'=>9],  // Austria - German
                ['country_id'=>26,'language_id'=>13], // Belgium - Dutch
                ['country_id'=>26,'language_id'=>10], // Belgium - French
                ['country_id'=>27,'language_id'=>17], // Poland - Polish
                ['country_id'=>28,'language_id'=>18], // Greece - Greek
                ['country_id'=>29,'language_id'=>16], // Portugal - Portuguese

                // آمریکای شمالی
                ['country_id'=>30,'language_id'=>5],  // United States - English
                ['country_id'=>31,'language_id'=>5],  // Canada - English
                ['country_id'=>31,'language_id'=>10], // Canada - French
                ['country_id'=>32,'language_id'=>12], // Mexico - Spanish
            ]
        );
    }
}
