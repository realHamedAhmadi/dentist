<?php

namespace Modules\Core\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('languages')->truncate();

        DB::table('languages')->insert([
                // زبان‌های اصلی
                ['id'=>1,'name'=>'Persian','native_name'=>'فارسی','code'=>'fa','dir'=>'RTL'],
                ['id'=>2,'name'=>'Dari','native_name'=>'دری','code'=>'prs','dir'=>'RTL'],
                ['id'=>3,'name'=>'Pashto','native_name'=>'پښتو','code'=>'ps','dir'=>'RTL'],
                ['id'=>4,'name'=>'Urdu','native_name'=>'اردو','code'=>'ur','dir'=>'RTL'],
                ['id'=>5,'name'=>'English','native_name'=>'English','code'=>'en','dir'=>'LTR'],
                ['id'=>6,'name'=>'Arabic','native_name'=>'العربية','code'=>'ar','dir'=>'RTL'],
                ['id'=>7,'name'=>'Kurdish','native_name'=>'Kurdî','code'=>'ku','dir'=>'LTR'],
                ['id'=>8,'name'=>'Turkish','native_name'=>'Türkçe','code'=>'tr','dir'=>'LTR'],
                ['id'=>9,'name'=>'German','native_name'=>'Deutsch','code'=>'de','dir'=>'LTR'],
                ['id'=>10,'name'=>'French','native_name'=>'Français','code'=>'fr','dir'=>'LTR'],
                ['id'=>11,'name'=>'Italian','native_name'=>'Italiano','code'=>'it','dir'=>'LTR'],
                ['id'=>12,'name'=>'Spanish','native_name'=>'Español','code'=>'es','dir'=>'LTR'],
                ['id'=>13,'name'=>'Dutch','native_name'=>'Nederlands','code'=>'nl','dir'=>'LTR'],
                ['id'=>14,'name'=>'Swedish','native_name'=>'Svenska','code'=>'sv','dir'=>'LTR'],
                ['id'=>15,'name'=>'Norwegian','native_name'=>'Norsk','code'=>'no','dir'=>'LTR'],
                ['id'=>16,'name'=>'Portuguese','native_name'=>'Português','code'=>'pt','dir'=>'LTR'],
                ['id'=>17,'name'=>'Polish','native_name'=>'Polski','code'=>'pl','dir'=>'LTR'],
                ['id'=>18,'name'=>'Greek','native_name'=>'Ελληνικά','code'=>'el','dir'=>'LTR'],
                ['id'=>19,'name'=>'Armenian','native_name'=>'Հայերեն','code'=>'hy','dir'=>'LTR'],
                ['id'=>20,'name'=>'Azerbaijani','native_name'=>'Azərbaycan dili','code'=>'az','dir'=>'LTR'],
                ['id'=>21,'name'=>'Turkmen','native_name'=>'Türkmençe','code'=>'tk','dir'=>'LTR'],
                ['id'=>22,'name'=>'Farsi (Afghanistan)','native_name'=>'فارسی افغانستان','code'=>'fa-AF','dir'=>'RTL'],
            ]
        );
    }
}
