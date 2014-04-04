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
storing traces in a kTBS.
This solution allow to benefit from all the services offered
by the ktbs, but requires to install a kTBS.

Further solutions will be offered to connect to other trace 
management systems.

### Trace visualisation

Samotraces.js provides trace visualisation widgets. Each 
widget can be using other visualisation frameworks or tools.

Currently, the main visualisation widget uses the d3.js 
framework. Other visualisation widgets are coming soon...


Examples
--------

Check out the example of a trace visualisation provided in 
the examples/ folder.

How to use Samotraces.js?
-------------------------

In order to use Samotraces.js, you must include the 
Samotraces.js script into the HTML page you are developping.
The latest Samotraces.js file can be found in the dist/ 
directory of Samotraces.js repository.

```
<script type="text/javascript" src="Samotraces.js"></script>
```

For developpers contributing to Samotraces.js, 
you can call the src/generate_samotraces.php
script to re-generate a Samotraces.js file that includes the
changes that have been made in the src/ folder.

As Samotraces.js uses some UTF-8 characters, the HTML 
document must explicitly use the UTF-8 charser. The following
code must be included in the HTML header of the document:
```
<meta charset="utf-8">
```

How to read this documentation?
-------------------------------

This documentation provides you with the information you need to use Samotraces.js
and develop your own Trace-Based Systems (TBS).

It is recommended that you navigate through this doc with the Namespace menu 
rather than the Class menu.
The code is structured into namespaces that allow to easily identify objects.
The documentation follows the same structure as the code:
All the widgets are contained in the {@link Samotraces.UI.Widgets} namespace
and all the logical core objects and shared functions are stored in 
the {@link Samotraces} namespace.
The global {@link Samotraces} namespace is shared by all Samotraces.js objects
in order to prevent potential incompatibility issues with other JavaScript
frameworks or libraries.

### About the Widgets

Widgets are reusable objects that provide a graphical user interface.
For instance, available widgets can:

- Display a trace, with obsels represented graphically as images
({@link Samotraces.UI.Widgets.TraceDisplayIcons|TraceDisplayIcons widget})
- Display the attributes of an obsel
({@link Samotraces.UI.Widgets.ObselInspector|ObselInspector widget})
- Display a time scale
({@link Samotraces.UI.Widgets.WindowScale|WindowScale widget})
- Import a CSV file in a trace
({@link Samotraces.UI.Widgets.ImportTrace|ImportTrace widget})
- Display the current time
({@link Samotraces.UI.Widgets.TimeForm|TimeForm widget} or
{@link Samotraces.UI.Widgets.ReadableTimeForm|ReadableTimeForm widget})
- And more! Have a look at the {@link Samotraces.UI.Widgets|full list of widgets}.

### About the core Objects 

Core (Logical) Objects that are shared by widgets are included in the {@link Samotraces} namespace.
These include :

- Trace objects, either stored in client's memory
({@link Samotraces.LocalTrace|LocalTrace}) or in a kTBS
({@link Samotraces.KTBS.Trace|KTBS.Trace}).
- Timer objects, that store the current time of some visualisations
({@link Samotraces.Timer|Timer}).
- Time window objects, that stores the current time window of some visualisations
({@link Samotraces.TimeWindow|TimeWindow}).
- Selector objects, that store a selection of other objects (Traces, Obsels, etc.)
({@link Samotraces.Selector|Selector}).


