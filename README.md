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
jQuery('.multiselect').multiselect();
```

## Options

| Option | Default | Description |
| --- | :---: | --- |
| `collapseOptGroupsByDefault` | `true` | When an optgroup exists in a select, collapse them. |
| `enableCaseInsensitiveFiltering` | `true` | Enable case insensitive filtering when filtering is enabled. |
| `enableCollapsibleOptGroups` | `true` | Make optgroups collapsible. |
| `enableFiltering` | `false` | Enable a search filter to select options with. |
| `includeSelectAllOption` | `false` | Include an option to "Select All". This is typically disabled because the `includeSelectAllOptionMin` is normally used. |
| `includeSelectAllOptionMin` | `50` | Minimum number of options that trigger the "Select All" option be enabled. |
| `minScreenWidth` | `576` | Minimum screen width where multiselect is enabled. |
| `selectAllDeselectAll` | `false` | De-select all options if the "Select All" option is selected. |
| `selectAllText` | `'All'` | The text for "Sselect All" option. |
| `selectAllValue` | `''` | The value for the "Select All" option. |

## Demo

<a href="https://lesilent.github.io/datepicker-bs4">Online Demo</a>