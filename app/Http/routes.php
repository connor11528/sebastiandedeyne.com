<?php

Route::feeds();

Route::get('/', 'HomeController@index');
Route::get('/open-source', 'OpenSourceController@index');
Route::get('/{slug}', 'ArticleController@detail')->where('slug', '(.*)');
