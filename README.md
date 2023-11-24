datepicker-bs4
==============
date picker for Bootstrap 4

## Installation

### Dependencies
- [jQuery](https://jquery.com/)
- [Bootstrap](https://getbootstrap.com/docs/4.6/) v4
- [Day.js](https://day.js.org/)
- [Font Awesome](https://fontawesome.com/v5/docs) v5

### Manual

```html
<link href="/path/to/bootstrap.css" rel="stylesheet" />
<script src="/path/to/jquery.js"></script>
<script src="/path/to/bootstrap.js"></script>
<script src="/path/to/dayjs.js"></script>
<script src="/path/to/fontawesome.js"></script>
<script src="/path/to/datepicker-bs4.js"></script>
```

### Usage

```html
<div class="row justify-content-center">
<div class="form-group col-6">
<label for="birth_date">Birth Date:</label>
<div class="input-group">
<input type="text" id="birth_date" class="form-control" name="birth_date" />
<div class="input-group-append"><button type="button" class="btn btn-outline-secondary" data-toggle="datepicker"><i class="far fa-calendar-alt"></i></button></div>
</div>
</div><!-- /.form-group -->
</div>
```

```javascript
jQuery('#birth_date').datepicker();
```

## Options

| Option | Default | Description |
| --- | :---: | --- |
| `format` | `MM/DD/YYYY` | Date format using [Day.js format tokens](https://day.js.org/docs/en/display/format). For custom formats, additional [Day.js plugins](https://day.js.org/docs/en/plugin/plugin) may need to be installed. |
| `maxDate` | `null` | The maximum allowed date in YYYY-MM-DD format. This can also be specified using a "max" attribute on the input tag. |
| `minDate` | `1900-01-01` | The minimum allowed date in YYYY-MM-DD format. This can also be specified using a "min" attribute on the input tag. |
| `popoverWidth` | `19rem` | Width of the Bootstrap popover. |
| `startView` | `day` | The view the picker should show when opened. Valid values include "year", "month", or "day". Useful for date-of-birth pickers. |
| `theme` | `light` | The visual theme to apply to the picker. Valid values include "light", "dark", or "auto". When "auto", the theme is dependent on the browser's configured mode/theme. |

### Defaults

The default plugin options can be overridden so that they're applied to all pickers.

```javascript
jQuery.fn.datepicker.theme = 'auto';
```

## Demo

<a href="https://lesilent.github.io/datepicker-bs4">Online Demo</a>