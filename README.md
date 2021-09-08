datepicker-bs4
==============
date picker for Bootstrap 4

## Installation

### Dependencies
- [jQuery](https://jquery.com/)
- [bootstrap](https://getbootstrap.com/) v4
- [fontawesome](https://fontawesome.com/) v5

### Manual

```html
<link href="/path/to/bootstrap.css" rel="stylesheet" />
<script src="/path/to/jquery.js"></script>
<script src="/path/to/bootstrap.js"></script>
<script src="/path/to/regular.js"></script>
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
| `format` | `MM/DD/YYYY` | Date format using [Dayjs format](https://day.js.org/docs/en/display/format). |
| `maxDate` | `null` | The maximum allowed date in YYYY-MM-DD format. |
| `minDate` | `1900-01-01` | The minimum allowed date in YYYY-MM-DD format. |
| `includeSelectAllOptionMin` | `50` | Minimum number of options that trigger the "Select All" option be enabled. |
| `minScreenWidth` | `576` | Minimum screen width where datepicker is enabled. |
| `popoverWidth` | `19rem` | Width of the Bootstrap popover. |

## Demo

<a href="https://lesilent.github.io/datepicker-bs4">Online Demo</a>