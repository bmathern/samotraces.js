Samotraces.js documentation
===========================

About Samotraces 
----------------

Samotraces.js is a framework for the development of trace-based applications.
It offers ways to easily developed synchronised, multi-view, multi-scale,
multi-sources visualisations.

"Samotraces" stands for "a framework for scanning, skiming,
supervising, apprehending, analysing, manipulating, managing and organizing
observed traces".

How to use Samotraces.js?
-------------------------

In order to use Samotraces.js, you must include the 
Samotraces.js script into the HTML page you are developping.
The latest Samotraces.js file can be found in the lib/ 
directory of Samotraces.js repository.

```
<script type="text/javascript" src="Samotraces.js"></script>
```

For developpers, you can call the src/generate_samtraces.php
script to re-generate a Samotraces.js file that include the
changes that have been made in the src folder.

As Samotraces.js uses some UTF-8 characters, the HTML 
document must explicitly use the UTF-8 charser. The following
code must be included in the HTML header of the document:
```
<meta charset="utf-8">
```

How to read this documentation?
-------------------------------

This documentation includes the information you need to use Samotraces.js
to develop your own Trace-Based Systems (TBS).

The code is structured into namespaces that allow to easily identify objects.
The documentation follows the same structure as the code:
All the widgets are contained in the {@link Samotraces.Widgets} namespace
and all the logical objects and shared functions are stored in 
the {@link Samotraces.Lib} namespace.
The global {@link Samotraces} namespace is shared by all Samotraces.js objects
in order to prevent potential incompatibility issues with other JavaScript
frameworks or libraries.

### About the Widgets

Widgets are reusable objects that provide a graphical user interface.
For instance, available widgets can:

- Display a trace, with obsels represented graphically as images
({@link Samotraces.Widgets.TraceDisplayIcons|TraceDisplayIcons widget})
- Display the attributes of an obsel
({@link Samotraces.Widgets.ObselInspector|ObselInspector widget})
- Display a time scale
({@link Samotraces.Widgets.WindowScale|WindowScale widget})
- Import a CSV file in a trace
({@link Samotraces.Widgets.ImporTrace|WindowScale widget})
- Display the current time
({@link Samotraces.Widgets.TimeForm|TimeForm widget} or
{@link Samotraces.Widgets.ReadableTimeForm|ReadableTimeForm widget})
- And more! Have a look at the {@link Samotraces.Widgets|full list of widgets}.

### About the Lib

(Logical) Objects that are shared by widgets are included in the {@link Samotraces.Lib} namespace.


Samotraces.js
-------------

Samotraces.js is a JavaScript version of the Samotraces 
project (see http://sourceforge.net/projects/samotraces/).
Samotraces.js provides a set of tools to collect, 
visualise, tansforme and manage traces.

### Trace management

Samotraces.js offers differents solutions to manage traces.
A first, lightweight solution consists in creating and 
managing the trace solely on the client side. This solution 
is useful for testing Samotraces and doesn't require any 
installation of trace management software. You can try it 
now on your web-browser. However, the created trace will not
be stored.

The second main solution currently implemented consists in 
storing traces in a ktbs (see TODO).
This solution allow to benefit from all the services offered
by the ktbs.
This solution requires to install a ktbs software.

Further solutions will be offered to connect to other trace 
management systems.

### Trace collection

### Trace visualisation

Samotraces.js provides trace visualisation widgets. Each 
widget can be using other visualisation frameworks or tools.

Currently, the main visualisation widget uses the d3.js 
framework. Other visualisation widgets are coming soon...


Examples
--------

Check out the example of a trace visualisation provided in 
the examples folder.

Change log
----------

### v0.1

## Samotraces.Widgets.TraceDisplayIcons
The Samotraces.Widgets.TraceDisplayIcons widget constructor
signature has changed:

- the Samotraces.Widgets.ObselSelector is not used anymore
- the options parameter has been changed:
  - the old options parameters are stored in options.visu
  - a new parameter options.events (Samotraces.Widgets.EventConfig)
    manages default responses to the widget's events.
