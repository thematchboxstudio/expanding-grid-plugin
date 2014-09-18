expanding-grid-plugin
=====================

Initialize the plugin with Grid.init();

HTML STRUCTURE======================

You must structure your HTML in the following way:

&lt;ul class="expanding-grid"&gt; <br>
  &lt;li&gt; <br>
    &lt;div class="outer-content"&gt; <br>
      &lt;!-- ALL EXTERIOR CONTENT HERE --&gt; <br>
    &lt;/div&gt; <br>
    &lt;div class="inner-content&gt; <br>
      &lt;div&gt; <br>
        &lt;!-- ALL INTERIOR DRAWER CONTENT HERE --&gt; <br>
      &lt;/div&gt; <br>
    &lt;/div&gt; <br>
  &lt;/li&gt; <br> 
&lt;/ul&gt; <br>

You can then add as may li items as necessary to create your grid.

Be sure to include the "component.css" file for general styling. Near the bottom of the css file are extra styles that were included for the demo that can be removed or changed.
