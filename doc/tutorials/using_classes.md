Classes in Samotraces.js
========================

Samotraces.js uses HTML classes to make it easier to define CSS styles
and to program the UI (User Interface) behaviours.

Classes are used in two main ways:

- each Widget instance has a class corresponding to the Widget name.
- each logical object with a graphical representation on the UI has a class 
  corresponding to the logical object type.

### Classes for widgets

Each Widget is instanciated in a div. This div will be given at least two classes:
the <code>Widget</code> class and the class name corresponding to the Widget's name.
For instance, the {@link Samotraces.Widgets.TraceDisplayIcons|TraceDisplayIcons} widget
has the class <code>Widget</code> and the class <code>TraceDisplayIcons</code>.

This can be used by the application developper to customise the CSS style of each widget.
The <code>Widget</code> class can be used to define CSS properties that are shared by all widgets.

### Classes for objects visual representation

While, the classes associated with objects' visual representation can also be used 
in combination with CSS to customise the style, the main reason of their development
was to offer an easy way to define UI behaviours in combination with jQuery.

The class names are defined by the lowercase name of the object prefixed by the
"Samotraces-" String.
For instance, the visual representation of an Obsel will be associated to the
<code>Samotraces-obsel</code> class. With jQuery, the following code will therefore allow to capture
any click on any obsel on the page:

<pre class="prettyprint sunlight-highlight-javascript linenums">$('body').on('click','.Samotraces-obsel',callback);
</pre>

## Data binding

In addition to the class, each HTML object representation is associated to the actual
Object it represent. For instance, an HTML image element representing an obsel would
have the <code>Samotraces-obsel</code> class and also contain the data of the actual 
{@link Samotraces.Lib.Obsel|Obsel} it represents.

This data can be retrieved by using the 
<a link="http://api.jquery.com/jQuery.data/">jQuery $.data()</a> method.

Here is how you retrieve the information:
<pre class="prettyprint sunlight-highlight-javascript linenums">$.data(ELEMENT,DATA_KEY);
</pre>

Each Samotraces.js object is associated with two <code>DATA_KEY</code>:

- <code>Samotraces-type</code>, which contains the Samotraces type of the object, and
- <code>Samotraces-data</code>, which contains the actual Samotraces object.

## Full example

Now, we can write a full example of how to define a behaviour of the UI using the
classes and the data binding. As a simple example, a click on an obsel will display
the id of that obsel in the JavaScript console.

Above, in the "Classes for objects visual representation" section we have already
define how to listen to the click event on obsels.
Now, let's define the callback function.
The callback function must have one argument corresponding to the event object.
The event.target object refers to the target of the event, which is the HTML element
that has been clicked on. And as we have seen above, this HTML element is bound
to the actual corresponding Obsel. Putting it all in practice, the following
callback should do the job:

<pre class="prettyprint sunlight-highlight-javascript linenums">var callback = function(event) {

	// The "obsel" variable will store the Obsel object
	var obsel = $.data(event.target,'Samotraces-data');
	
	// Note that this callback is only called on 'Samotraces-obsel' class,
	// therefore we know an obsel was the target of the event.
	// Otherwise, we would have to check if it is an obsel.
	
	// Now let's display the id of the Obsel
	console.log(obsel.get_id());
};
</pre>
