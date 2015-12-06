jquery.windfury.js
========================================

Windfury Template jQuery Plugin

[![Build Status](https://travis-ci.org/renatoferreira656/jquery.windfury.js.png?branch=master)](https://travis-ci.org/renatoferreira656/jquery.windfury.js)

Description
========================================
Windfury is a Web framework where it's focus is help divide the presentation layer of your system in components.

It's has three import parts
  - A parser where it you have to pass a text where is in a windfury pattern, and it will execute and return to you a exported function.
  - A implementation where you can pass the windfury file path and in a callback function it will return the exported object to you. This way you can divide your application and call template anywhere you want.
  - A layer of extension where you can create anything you want to.


API
========================================


### `$.windfury(windfuryPattern, successCallback)`

- **windfuryPattern:** this is the text pattern where must have a section tag root with a class windfury, inside the tag must have a script section, example:
~~~~~~~~~~~~~~~~~~
  <section class="windfury">
      <script type="text/javascript">
      </script>
  </section>
~~~~~~~~~~~~~~~~~~
the scope of the section value you will have a object called windfury, this object has a group functions like:
  - `windfury.def(anyvalue)`:  the value defined here you will receive in the success callback, can be any value you want.

  - `windfury.read(clazz)`: this function will look for a section inside the section.windfury with the name you pass to it. The return will be a text of the inner Html of section you are looking for.

  - `windfury.text(clazz)`: is the same as windfury.read, but this function will return a function to you. This method is for compatibility purpose.

  - `windfury.doT(clazz)`: is the same as windfury.read, but this function will compile a [doT](http://olado.github.io/doT/index.html) function to you. This is added to help create templates from json.

  - `windfury.req(array, successCallback)`: this is a helper function created to isolated the scope of the script tag, it's first parameters is a array where you can pass all windfury templates you want to find. The second parameter is a function the first parameter will be the jQuery and the second will be the windfury, after the will come all the objects defined inside the templates asked for in the array.
  When using this function you can call a function `$.wf.autoloads(array);`, the array parameters is filled with urls of windfury files, the idea is when you call the req function after jQuery parameter will come the objects of autoload and only after that will come the objects where you require.


- **successCallback:** this a function where you will receive the value where you defined in the section script.

### `$.getWindfury(url, data, success, error)`

- **url:** is the url of a windfury templates
- **data [optional field]:** is values if you and to send anything to the ajax needed to ask for the windfury template
- **success:** function where will be called after the template is parsed and executed, this function you will receive the parameters you define in the def function.
- **error [optional field]:** if in any reason the ajax for getting the template isn't workout this function will be called.

### `$.wf(urls, success, error)`
- **urls:** is a array of urls with windfury templates
- **success:** function where will be called after all templates are parsed and executed, this function you will receive all the parameters you define in the def function in the array order.
- **error [optional field]:** if in any reason the any of  the ajax for getting a template isn't workout this function will be called.

Getting Started
========================================

This is a simple example of a [single page html](./src/main/webapp/sample.html), isn't needed for the windfury work out, but it's is to exemplify the workflow

This is a example of hashchange using windfury, where we consider that all pages of this website will be available at /page and have a exported function called open, here is the example of the [main javascript](./src/main/webapp/js/main.js)

The page we've created is called [Main.html](./src/main/webapp/page/Main.html) and it use two of our components available in /comp you can see the components in [here](./src/main/webapp/comp)

Issues
========================================
If you found some issues feel free to contact us or open a issue, will be the great help.
If need some help with, you can contact us too, we are always willing to help.

Download
========================================

[jquery.windfury.js latest release](https://github.com/renatoferreira656/jquery.windfury.js/releases/tag/1.1.0)

[jquery.windfury.js file code](http://renatoferreira656.github.io/jquery.windfury.js/src/main/webapp/js/jquery.windfury.js)
