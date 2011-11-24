Hopkins Planner
=============

This is me playing around with markdown. For now, disregard this file.

Markups
-------

The following markups are supported.  The dependencies listed are required if
you wish to run the library.

* [.markdown](http://daringfireball.net/projects/markdown/) -- `gem install redcarpet` (https://github.com/tanoku/redcarpet)
* this
* is
* a
* list
* with
* [links](http://google.com/) -- `and stuff`

This is a Header
------------

Text...

### This is a smaller header

If your markup is in a language other than Ruby, drop a translator
script in `lib/github/commands` which accepts input on STDIN and
returns HTML on STDOUT. See [rest2html][r2h] for an example.

Once your script is in place, edit `lib/github/markups.rb` and tell
GitHub Markup about it. Again we look to [rest2html][r2hc] for
guidance:

    This text has been indented once

### Code

Let's test some code blocks:

```javascript
function aloha(){
	if (myFace == ugly){
		return "you lie";
	}
}
```

Installation
-----------

    this is a command


Testing
-------

To run the tests:

    $ rake

To add tests see the `Commands` section earlier in this
README.


Contributing
------------

1. Fork it.
2. Create a branch (`git checkout -b my_markup`)
3. Commit your changes (`git commit -am "Added Snarkdown"`)
4. Push to the branch (`git push origin my_markup`)
5. Create an [Issue][1] with a link to your branch
6. Enjoy a refreshing Diet Coke and wait


[r2h]: http://github.com/github/markup/tree/master/lib/github/commands/rest2html
[r2hc]: http://github.com/github/markup/tree/master/lib/github/markups.rb#L13
[1]: http://github.com/github/markup/issues
