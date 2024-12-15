/**
 * Date picker for Bootstrap 4
 *
 * https://github.com/lesilent/datepicker-bs4
 */
(function () {
//-------------------------------------
'use strict';

/**
 * Flag for whether plugin has been initialized
 *
 * @type {boolean}
 */
let initialized = false;

/**
 * Array of abbreviated month names
 *
 * @type {array}
 */
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * Return the effective year to use
 *
 * @param {string} month_day
 * @param {object} options
 * @return {number}
 */
function getYear(month_day, options)
{
	let year = new Date().getFullYear();
	const input_date = dayjs(year + '-' + month_day);
	if (input_date && input_date.isValid())
	{
		if (options.minDate && input_date.isBefore(options.minDate, 'date'))
		{
			year = options.minDate.year() + 1;
		}
		else if (options.maxDate && input_date.isAfter(options.maxDate, 'date'))
		{
			year = options.maxDate.year() - 1;
		}
	}
	return year;
}

/**
 * Parse a date string and return a dayjs object
 *
 * @param {string} str
 * @param {object} options
 * @return {object|boolean} either a dayjs object or false on error
 */
function parseDate(str, options)
{
	let input_date = false, matches;
	if (typeof str == 'string')
	{
		str = str.replace(/^\s+|\s+$/g, '');
		if ((matches = str.match(/^(\d{4})\s*\-\s*([01]\d)\s*\-\s*([0-3]\d)$/))
			&& parseInt(matches[2]) > 0 && parseInt(matches[2]) < 13
			&& parseInt(matches[3]) > 0 && parseInt(matches[3]) < 32)
		{
			input_date = dayjs(str);
		}
		else if ((matches = str.match(/^([01]?\d)\s*[\/\-\.]?\s*([0-3]?\d)(?:\s*[\/\-\.]?\s*((\d{2})?\d{2}))?$/))
			&& parseInt(matches[1]) > 0 && parseInt(matches[1]) < 13
			&& parseInt(matches[2]) > 0 && parseInt(matches[2]) < 32
			&& /^MM?\s*[\/\-\.]?\s*DD?\s*[\/\-\.]?\s*YY(YY)?$/.test(options.format))
		{
			const month_day = ((matches[1].length > 1) ? '': '0') + matches[1] + '-' + ((matches[2].length > 1) ? '' : '0') + matches[2];
			if (matches[3] === undefined)
			{
				matches[3] = getYear(month_day, options);
			}
			else if (matches[3].length == 2)
			{
				matches[3] = Math.floor(new Date().getFullYear() / 100) * 100 - ((parseInt(matches[3]) >= 50) ? 100 : 0) + parseInt(matches[3]) ;
			}
			input_date = dayjs(matches[3] + '-' + month_day);
		}
		else if ((matches = str.match(/^([0-3]?\d)\s*[\/\-\.]?\s*([01]?\d)(?:\s*[\/\-\.]?\s*((\d{2})?\d{2}))?$/))
			&& parseInt(matches[1]) > 0 && parseInt(matches[1]) < 32
			&& parseInt(matches[2]) > 0 && parseInt(matches[2]) < 13
			&& /^DD?\s*[\/\-\.]?\s*MM?\s*[\/\-\.]?\s*YY(YY)?$/.test(options.format))
		{
			const month_day = ((matches[2].length > 1) ? '': '0') + matches[2] + '-' + ((matches[1].length > 1) ? '' : '0') + matches[1];
			if (matches[3] === undefined)
			{
				matches[3] = getYear(month_day, options);
			}
			if (matches[3].length == 2)
			{
				matches[3] = Math.floor(new Date().getFullYear() / 100) * 100 - ((parseInt(matches[3]) >= 50) ? 100 : 0) + parseInt(matches[3]) ;
			}
			input_date = dayjs(matches[3] + '-' + month_day);
		}
		else if ((matches = str.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*([0-3]?\d)(?:st|nd|rd|th)?(?:[\s,]+(\d{4}))?\b/i))
			&& parseInt(matches[2]) > 0 && parseInt(matches[2]) < 32)
		{
			const month = MONTHS.indexOf(matches[1].toLowerCase()) + 1;
			const month_day = ((month > 9) ? '': '0') + month.toString() + '-' + ((matches[2].length > 1) ? '' : '0') + matches[2];
			if (matches[3] == undefined)
			{
				matches[3] = getYear(month_day, options);
			}
			input_date = dayjs(matches[3] + '-' + month_day);
		}
		else if ((matches = str.match(/\b([0-3]?\d)(?:st|nd|rd|th)?\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(?:[\s,]+(\d{4}))?\b/i))
			&& parseInt(matches[1]) > 0 && parseInt(matches[1]) < 32)
		{
			const month = MONTHS.indexOf(matches[2].toLowerCase()) + 1;
			const month_day = ((month > 9) ? '': '0') + month.toString() + '-' + ((matches[1].length > 1) ? '' : '0') + matches[1];
			if (matches[3] == undefined)
			{
				matches[3] = getYear(month_day, options);
			}
			input_date = dayjs(matches[3] + '-' + month_day);
		}
		else
		{
			input_date = (options && options.format)
				? dayjs(str, options.format)
				: dayjs(str);
		}
	}
	else
	{
		input_date = dayjs(str);
	}
	return (input_date && input_date.isValid() && !(options &&
		((options.minDate && input_date.isBefore(options.minDate, 'date'))
		|| (options.maxDate && input_date.isAfter(options.maxDate, 'date')))))
		? input_date : false;
}

/**
 * Update the year selector in the popover
 *
 * @param {object} $input the input object
 */
 function updateYearPicker($input)
 {
	const input_id = $input.attr('id');
	const options = $input.data('options');
	const input_date = parseDate($input.val(), options);
	const today = dayjs();
	let viewDate = $input.data('viewdate') || today;

	// Get date for view
	const viewYear = viewDate.year();
	const startYear = viewYear - (viewYear % 5) - 15;
	const startDate = dayjs(startYear + '-01-01').startOf('year');
	const endYear = (startYear + 29);
	const endDate = dayjs(endYear + '-12-31').endOf('year');

	const today_disabled = ((options.minDate && today.isBefore(options.minDate, 'date'))
		|| (options.maxDate && today.isAfter(options.maxDate, 'date'))
		|| (today.year() >= startYear && today.year() <= endYear)
	);

	// Build html
	let html = '<div class="d-flex justify-content-between align-items-center datepicker-btns">'
		+ '<div class="font-weight-bold"><button type="button" id="' + input_id + '-picker-btn" class="btn font-weight-bold dropdown-toggle">' + startDate.year() + ' - ' + endDate.year()  + '</button></div><div>'
		+ '<a id="' + input_id + '-picker-prev-link" class="btn btn-link px-1 mx-0' + ((!options.minDate || options.minDate.isBefore(startDate, 'date')) ? '' : ' disabled') + '" href="javascript:void(0)" title="Go to Previous Years"><i class="fas fa-chevron-left fa-fw"></i></a>'
		+ '<a id="' + input_id + '-picker-today-link" class="btn btn-link px-1 mx-0' + (today_disabled ? ' disabled' : '') + '" href="javascript:void(0)" title="Go to Current Year"><i class="far fa-calendar-check fa-fw"></i></a>'
		+ '<a id="' + input_id + '-picker-next-link" class="btn btn-link px-1 mx-0' + ((!options.maxDate || options.maxDate.isAfter(endDate, 'date')) ? '' : ' disabled') + '" href="javascript:void(0)" title="Go to Next Years"><i class="fas fa-chevron-right fa-fw"></i></a>'
		+ '</div></div>'
		+ '<table class="table table-sm table-borderless text-center datepicker-table mb-1"><thead class="thead-light"><tr><th class="py-1" colspan="5"><span class="invisible">Year</span></th></tr></thead><tbody>';
	for (let i = 0; i < (endYear - startYear + 1); i++)
	{
		const i_date = viewDate.year(startYear + i);
		const disabled = ((options.minDate && options.minDate.isAfter(i_date.endOf('year'), 'date'))
			|| (options.maxDate && options.maxDate.isBefore(i_date.startOf('year'), 'date')));
		html += ((i % 5 == 0) ? '<tr>' : '')
			+ '<td class="text-center p-0"><button type="button" class="btn btn-block px-0 '
			+ ((input_date && input_date.isSame(i_date, 'year')) ? 'active btn-info'
			: 'btn-outline-dark border-white' + (i_date.isSame(today, 'year') ? ' today' : ''))
			+ '" ' + (disabled ? 'disabled="disabled"' : 'data-year="' + i_date.year() + '"') + '>' + i_date.year() + '</button></td>'
			+ ((i % 5 == 4) ? '</tr>' : '');
	}
	html += '</table>';
	const $content = jQuery('#' + input_id + '-picker-content');
	$content.parents('.datepicker-popover').attr('data-scheme', (options.scheme == 'auto') ? ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : '') : options.scheme);
	$content.html(html).find('table button').on('click', function () {
		viewDate = viewDate.year(jQuery(this).data('year'));
		$input.data('viewdate', viewDate);
		updateMonthPicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: viewDate
		}]);
	});
	jQuery('#' + input_id + '-picker-prev-link').on('click', function () {
		viewDate = $input.data('viewdate').subtract(30, 'year');
		jQuery(this).addClass('active disabled');
		$input.data('viewdate', viewDate);
		updateYearPicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: viewDate
		}]);
	});
	jQuery('#' + input_id + '-picker-next-link').on('click', function () {
		viewDate = $input.data('viewdate').add(30, 'year');
		jQuery(this).addClass('active disabled');
		$input.data('viewdate', viewDate);
		updateYearPicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: viewDate
		}]);
	});
	jQuery('#' + input_id + '-picker-today-link').on('click', function () {
		viewDate = today;
		jQuery(this).addClass('active disabled');
		$input.data('viewdate', viewDate);
		updateYearPicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: viewDate
		}]);
	});
	jQuery('#' + input_id + '-picker-btn').on('click', function () {
		updateMonthPicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: $input.data('viewdate')
		}]);
	});
 }

 /**
  * Update the month selector in the popover
  *
  * @param {object} $input the input object
  */
 function updateMonthPicker($input)
 {
	const input_id = $input.attr('id');
	const options = $input.data('options');
	const input_date = parseDate($input.val(), options);
	const today = dayjs();
	let viewDate = $input.data('viewdate') || today;
	const today_disabled = ((options.minDate && today.isBefore(options.minDate, 'date'))
		|| (options.maxDate && today.isAfter(options.maxDate, 'date'))
		|| today.isSame(viewDate, 'year')
	);

	let html = '<div class="d-flex justify-content-between align-items-center datepicker-btns">'
		+ '<div class="font-weight-bold"><button type="button" id="' + input_id + '-picker-btn" class="btn font-weight-bold dropdown-toggle">' + viewDate.format('YYYY') + '</button></div><div>'
		+ '<a id="' + input_id + '-picker-prev-link" class="btn btn-link px-1 mx-0' + ((!options.minDate || options.minDate.isBefore(viewDate.startOf('year'), 'date')) ? '' : ' disabled') + '" href="javascript:void(0)" title="Go to Previous Year" data-unit="month"><i class="fas fa-chevron-left fa-fw"></i></a>'
		+ '<a id="' + input_id + '-picker-today-link" class="btn btn-link px-1 mx-0' + (today_disabled ? ' disabled' : ' ') + '" href="javascript:void(0)" title="Go to Current Month"><i class="far fa-calendar-check fa-fw"></i></a>'
		+ '<a id="' + input_id + '-picker-next-link" class="btn btn-link px-1 mx-0' + ((!options.maxDate || options.maxDate.isAfter(viewDate.endOf('year'), 'date')) ? '' : ' disabled') + '" href="javascript:void(0)" title="Go to Next Year" data-unit="month"><i class="fas fa-chevron-right fa-fw"></i></a>'
		+ '</div></div>'
		+ '<table id="d-table" class="table table-sm table-borderless text-center datepicker-table mb-1"><thead class="thead-light"><tr><th class="py-1" colspan="3"><span class="invisible">Month</th></tr></thead><tbody>';
	for (let i = 0; i < 12; i++)
	{
		const i_date = viewDate.month(i);
		const disabled = ((options.minDate && options.minDate.isAfter(i_date.endOf('month'), 'date'))
			|| (options.maxDate && options.maxDate.isBefore(i_date.startOf('month'), 'date')));
		html += ((i % 3 == 0) ? '<tr>' : '') + '<td class="text-center p-0"><button type="button" class="btn btn-block px-0 '
			+ ((input_date && input_date.isSame(i_date, 'month')) ? 'active btn-info'
			: 'btn-outline-dark border-white' + (i_date.isSame(today, 'month') ? ' today' : ''))
			+ '" ' + (disabled ? 'disabled="disabled"' : 'data-date="' + i_date.format('YYYY-MM-DD"')) + '>' + i_date.format('MMM') + '</button></td>' + ((i % 3 == 2) ? '</tr>' : '');
	}
	for (let i = 0; i < 6; i++)
	{
		html += ((i % 3 == 0) ? '<tr>' : '')
			+ '<td class="p-0"><button type="button" class="btn btn-block invisible px-0" disabled="disabled">&nbsp;</button></td>'
			+ ((i % 3 == 2) ? '</tr>' : '');
	}
	const $content = jQuery('#' + input_id + '-picker-content');
	$content.parents('.datepicker-popover').attr('data-scheme', (options.scheme == 'auto') ? ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : '') : options.scheme);
	$content.html(html).find('table button').on('click', function () {
		viewDate = dayjs(jQuery(this).data('date'));
		$input.data('viewdate', viewDate);
		updateDatePicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: viewDate
		}]);
	});
	jQuery('#' + input_id + '-picker-prev-link').on('click', function () {
		viewDate = $input.data('viewdate').subtract(1, 'year');
		jQuery(this).addClass('active disabled');
		$input.data('viewdate', viewDate);
		updateMonthPicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: viewDate
		}]);
	});
	jQuery('#' + input_id + '-picker-next-link').on('click', function () {
		viewDate = $input.data('viewdate').add(1, 'year');
		jQuery(this).addClass('active disabled');
		$input.data('viewdate', viewDate);
		updateMonthPicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: viewDate
		}]);
	});
	jQuery('#' + input_id + '-picker-today-link').on('click', function () {
		viewDate = today;
		jQuery(this).addClass('active disabled');
		$input.data('viewdate', viewDate);
		updateMonthPicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: viewDate
		}]);
	});
	jQuery('#' + input_id + '-picker-btn').on('click', function () {
		updateYearPicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: $input.data('viewdate')
		}]);
	});
}

/**
 * Update the calendar in the popover
 *
 * @param {object} $input the input object
 */
function updateDatePicker($input)
{
	const input_id = $input.attr('id');
	const options = $input.data('options');
	const input_date = parseDate($input.val(), options);
	const today = dayjs();
	let viewDate = $input.data('viewdate') || today;
	const today_disabled = ((options.minDate && today.isBefore(options.minDate, 'date'))
		|| (options.maxDate && today.isAfter(options.maxDate, 'date'))
		|| today.isSame(viewDate, 'month')
	);

	// Build html
	let html = '<div class="d-flex justify-content-between align-items-center datepicker-btns">'
		+ '<div class="font-weight-bold"><button type="button" id="' + input_id + '-picker-btn" class="btn font-weight-bold dropdown-toggle px-2">' + viewDate.format('MMMM YYYY') + '</button></div><div class="text-nowrap">'
		+ '<a id="' + input_id + '-picker-prev-link" class="btn btn-link px-1 mx-0' + ((!options.minDate || options.minDate.isBefore(viewDate.startOf('month'), 'date')) ? '' : ' disabled') + '" href="javascript:void(0)" title="Go to Previous Month" data-unit="month"><i class="fas fa-chevron-left fa-fw"></i></a>'
		+ '<a id="' + input_id + '-picker-today-link" class="btn btn-link px-1 mx-0' + (today_disabled ? ' disabled' : '') + '" href="javascript:void(0)" title="Go to Today"><i class="far fa-calendar-check fa-fw"></i></a>'
		+ '<a id="' + input_id + '-picker-next-link" class="btn btn-link px-1 mx-0' + ((!options.maxDate || options.maxDate.isAfter(viewDate.endOf('month'), 'date')) ? '' : ' disabled') + '" href="javascript:void(0)" title="Go To Next Month" data-unit="month"><i class="fas fa-chevron-right fa-fw"></i></a>'
		+ '</div></div>'
		+ '<table class="table table-sm table-borderless text-center datepicker-table mb-1"><thead class="thead-light"><tr>';
//		['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function (day) {
//			html += '<th class="py-1" scope="col" style="width:14.28%">' + day + '</th>';
//	});
	for (let i = 0; i < 7; i++)
	{
		html += '<th class="py-1 user-select-none" scope="col" style="width:14.28%">' + viewDate.day(i).format('dd') + '</th>';
	}
	html += '</tr></thead><tbody><tr>';
	let i_date;
	let dow = 0;
	const startMonth = viewDate.startOf('month');
	for (let i = startMonth.day(); i > 0; i--)
	{
		i_date = startMonth.subtract(i, 'day');
		const disabled = ((options.minDate && options.minDate.isAfter(i_date.endOf('date'), 'date'))
			|| (options.maxDate && options.maxDate.isBefore(i_date.startOf('date'), 'date')));
		html += '<td class="text-center p-0"><button type="button" class="btn btn-block px-0 '
			+ ((input_date && input_date.isSame(i_date, 'date')) ? 'active btn-info'
			: 'btn-outline-secondary border-white' + (i_date.isSame(today, 'date') ? ' today' : ''))
			+ '" ' + (disabled ? 'disabled="disabled"' : 'data-date="' + i_date.format('YYYY-MM-DD"')) + '>' + i_date.format('D') + '</button></td>';
		dow++;
	}
	let rows = 0;
	const days_in_month = viewDate.daysInMonth();
	for (let i = 1; i <= days_in_month; i++)
	{
		i_date = viewDate.date(i);
		const disabled = ((options.minDate && options.minDate.isAfter(i_date.endOf('date'), 'date'))
			|| (options.maxDate && options.maxDate.isBefore(i_date.startOf('date'), 'date')));
		html += ((dow == 0) ? '<tr>' : '') + '<td class="text-center p-0"><button type="button" class="btn btn-block px-0 '
			+ ((input_date && input_date.isSame(i_date, 'date')) ? 'active btn-info'
			: 'btn-outline-dark border-white' + (i_date.isSame(today, 'date') ? ' today' : ''))
			+ '" ' + (disabled ? 'disabled="disabled"' : 'data-date="' + i_date.format('YYYY-MM-DD"')) + '>' + i_date.format('D') + '</button></td>' + ((dow == 6) ? '</tr>' : '');
		rows += (dow == 6) ? 1 : 0;
		dow = (dow + 1) % 7;
	}
	if (dow > 0)
	{
		const nextMonth = viewDate.add(1, 'month');
		for (let i = 1; i <= (7 - dow); i++)
		{
			i_date = nextMonth.date(i);
			const disabled = ((options.minDate && options.minDate.isAfter(i_date.endOf('date'), 'date'))
				|| (options.maxDate && options.maxDate.isBefore(i_date.startOf('date'), 'date')));
			html += '<td class="text-center p-0"><button type="button" class="btn btn-block px-0 '
				+ ((input_date && input_date.isSame(i_date, 'date')) ? 'active btn-info'
				: ' btn-outline-secondary border-white' + (i_date.isSame(today, 'date') ? ' today' : ''))
				+ '" ' + (disabled ? 'disabled="disabled"' : 'data-date="' + i_date.format('YYYY-MM-DD"')) + '>' + i_date.format('D') + '</button></td>';
		}
		html += '</tr>';
		rows++;
	}
	for (let i = 0; i < ((6- rows) * 7); i++)
	{
		i_date = i_date.add(1, 'day');
		const disabled = ((options.minDate && options.minDate.isAfter(i_date.endOf('date'), 'date'))
			|| (options.maxDate && options.maxDate.isBefore(i_date.startOf('date'), 'date')));
		html += ((i % 7 == 0) ? '<tr>' : '') + '<td class="text-center p-0"><button type="button" class="btn btn-block px-0 '
			+ ((input_date && input_date.isSame(i_date, 'date')) ? 'active btn-info'
			: ' btn-outline-secondary border-white' + (i_date.isSame(today, 'date') ? ' today' : ''))
			+ '" ' + (disabled ? 'disabled="disabled"' : 'data-date="' + i_date.format('YYYY-MM-DD"')) + '>' + i_date.format('D') + '</button></td>'
			+ ((i % 7 == 6) ? '</tr>' : '');
	}
	html += '</tbody></table>';
	const $content = jQuery('#' + input_id + '-picker-content');
	$content.parents('.datepicker-popover').attr('data-scheme', (options.scheme == 'auto') ? ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : '') : options.scheme);
	$content.html(html).find('table button').on('click', function () {
		const newDate = dayjs(jQuery(this).data('date'));
		$input.val(newDate.format(options.format)).popover('hide').trigger('change');
	});
	jQuery('#' + input_id + '-picker-prev-link').on('click', function () {
		viewDate = $input.data('viewdate').subtract(1, 'month');
		jQuery(this).addClass('active disabled');
		$input.data('viewdate', viewDate);
		updateDatePicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: viewDate
		}]);
	});
	jQuery('#' + input_id + '-picker-next-link').on('click', function () {
		viewDate = $input.data('viewdate').add(1, 'month');
		jQuery(this).addClass('active disabled');
		$input.data('viewdate', viewDate);
		updateDatePicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: viewDate
		}]);
	});
	jQuery('#' + input_id + '-picker-today-link').on('click', function () {
		viewDate = today;
		jQuery(this).addClass('active disabled');
		$input.data('viewdate', viewDate);
		updateDatePicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: viewDate
		}]);
	});
	jQuery('#' + input_id + '-picker-btn').on('click', function () {
		updateMonthPicker($input);
		$input.trigger('update.datepicker', [{
			viewDate: $input.data('viewdate')
		}]);
	});
}

/**
 * Add method for initializing plugin
 */
jQuery.fn.datepicker = function (options) {
	// Get boostrap version
	const bs_version = parseInt(((typeof bootstrap == 'object') ? bootstrap.Dropdown.VERSION : jQuery.fn.dropdown.Constructor.VERSION || '0').replace(/\..+$/, ''));
	if (bs_version < 4)
	{
		console.error('Invalid bootstrap version ' + bs_version + ' detected');
	}

	// Handle functions
	if (typeof options == 'string')
	{
		if (this.length < 1)
		{
			return undefined;
		}
		let input_options = this.data('options') || {};
		const single_arg = (arguments.length == 1);
		switch (options)
		{
			case 'date':
				if (single_arg)
				{
					return parseDate(this.val(), input_options) || null;
				}
				else
				{
					const newDate = (arguments[1]) ? parseDate(arguments[1], input_options) : null;
					this.val((newDate && newDate.isValid()) ? newDate.format(input_options.format) : '');
				}
				break;
			case 'format':
				if (single_arg)
				{
					return input_options.format;
				}
				else if (arguments[1] && typeof arguments[1] == 'string')
				{
					input_options.format = arguments[1];
					this.data('options', input_options);
				}
				else
				{
					console.warn('Invalid format');
				}
				break;
			case 'minDate':
			case 'maxDate':
				if (single_arg)
				{
					return input_options[options];
				}
				else if (arguments[1])
				{
					const newDate = parseDate(arguments[1]);
					if (newDate && newDate.isValid())
					{
						input_options[options] = newDate;
						this.data('options', input_options);
					}
					else
					{
						console.warn('Invalid ' + options);
					}
				}
				else
				{
					input_options[options] = null;
					this.data('options', input_options);
				}
				break;
			case 'startView':
			case 'scheme':
				if (single_arg)
				{
					return input_options[options];
				}
				else if (arguments[1] === null || typeof arguments[1] == 'string')
				{
					input_options[options] = arguments[1];
					this.data('options', input_options);
				}
				else
				{
					console.warn('Invalid ' + options);
				}
				break;
			default:
				break;
		}
		return this;
	}

	// Initialize code if it hasn't already
	if (!initialized)
	{
		initialized = true;
		jQuery(document.head).append('<style id="datepicker-style">'
			+ '.datepicker-popover { font-size: 1rem !important; }'
			+ '.datepicker-btns .btn:hover { background-color: #e2e6ea; color: #000000; }'
			+ '.datepicker-table { font-size: inherit; }'
			+ '.datepicker-table td button:focus { box-shadow: none !important; }'
			+ '.datepicker-table td button:not(:disabled):hover { background-color: #6c757d !important; border-color: #6c757d !important; color: #fff; }'
			+ '.datepicker-table td button:disabled { cursor: not-allowed; }'
			+ '.datepicker-table td button.today { background-color: #fcf8e3; }'
			+ '.datepicker-popover[data-scheme="dark"] { background-color: #000000; border-color: #ffffff; color: #dee2e6; }'
			+ '.datepicker-popover[data-scheme="dark"] .popover-header { background-color: #343a40; color: #ffffff; }'
			+ '.datepicker-popover[data-scheme="dark"] .popover-header .close { filter: invert(1) grayscale(1) brightness(2); }'
			+ '.datepicker-popover[data-scheme="dark"] .datepicker-btns button.btn { color: #ffffff; }'
			+ '.datepicker-popover[data-scheme="dark"] .datepicker-btns a.btn { color: #0d6efd; }'
			+ '.datepicker-popover[data-scheme="dark"] .datepicker-btns .btn:hover { background-color: #6c757d; color: #ffffff; }'
			+ '.datepicker-popover[data-scheme="dark"] .datepicker-table .thead-light th { background-color: #212529; color: #ffffff; }'
			+ '.datepicker-popover[data-scheme="dark"] .datepicker-table .btn-outline-dark { color: #ffffff; }'
			+ '.datepicker-popover[data-scheme="dark"] .datepicker-table .border-white { border-color: transparent !important; }'
			+ '.datepicker-popover[data-scheme="dark"] .datepicker-table td button.today { background-color: #332701; color: #ffda6a; }'
			+ '</style>');

		// Make popovers close when clicked outside of them
		jQuery(document.body).on('mouseup', function (e) {
			if (jQuery(e.target).parents('.popover').length == 0)
			{
				jQuery('.datepicker').popover('hide');
			}
		});
	}

	// Process options
	if (typeof options == 'undefined')
	{
		options = {};
	}
	const common_options = jQuery.extend({}, jQuery.fn.datepicker.defaults, options);
	['minDate', 'maxDate'].forEach(function (option) {
		if (common_options[option])
		{
			common_options[option] = parseDate(common_options[option]);
		}
	});

	// Initialize the inputs
	return this.each(function () {
		const $input = jQuery(this);

		// Get input id
		let input_id = this.id;
		let $toggles = $input.siblings().find('[data-toggle="datepicker"]:not([data-target])');
		if (this.id)
		{
			$toggles = $toggles.add('[data-toggle="datepicker"][data-target="#' + this.id + '"]');
		}
		else
		{
			input_id = 'input-' + Math.floor(Math.random() * 1000000 + 1);
			this.id = input_id;
		}

		// Process options
		let input_options = jQuery.extend(true, {}, common_options);
		const format = $input.data('format') || common_options.format;
		if (format)
		{
			input_options.format = format;
		}
		let minDate = $input.attr('min') || $input.data('mindate') || common_options.minDate;
		if (minDate && (minDate = dayjs(minDate)) && minDate.isValid())
		{
			input_options.minDate = minDate.startOf('date');
		}
		let maxDate = $input.attr('max') || $input.data('maxdate') || common_options.maxDate;
		if (maxDate && (maxDate = dayjs(maxDate)) && maxDate.isValid())
		{
			input_options.maxDate = maxDate.endOf('date');
		}
		const startView = $input.data('startview') || common_options.startView;
		if (startView)
		{
			input_options.startView = startView;
		}
		const scheme = $input.data('scheme') || common_options.scheme;
		if (scheme)
		{
			input_options.scheme = scheme;
		}
		$input.data('options', input_options);
		if ($input.data('datepicker'))
		{
			// If datepicker is already initialized, then return
			return this;
		}
		$input.data('datepicker', true);
		$input.addClass('datepicker');

		// Set inputmode
		if (this.type == 'text' && !this.inputMode)
		{
			this.inputMode = 'tel';
		}

		const $label = jQuery('label[for="' + input_id + '"]');
		const placement = (window.screen.width > 575) ? 'bottom' : 'top';
		$input.on('change', function () {
			this.value = this.value.replace(/^\s+|\s+$/g, '');
			const options = $input.data('options');
			let newDate = parseDate(this.value, options);
			let newValue = '';
			if (newDate && newDate.isValid() && !(options.minDate && newDate.isBefore(options.minDate, 'date')) && !(options.maxDate && newDate.isAfter(options.maxDate, 'date')))
			{
				newValue = newDate.format(options.format);
			}
			else
			{
				newDate = null;
			}
			this.value = newValue;
		}).on('inserted.bs.popover', function () {
			jQuery('.popover').find('[data-dismiss="popover"]').on('click', function () {
				$input.popover('hide');
			});
			const options = $input.data('options');
			switch (options.startView)
			{
				case 'year': updateYearPicker($input); break;
				case 'month': updateMonthPicker($input); break;
				default: updateDatePicker($input);
			}
		}).popover({
			html: true,
			placement: placement,
			sanitize: false,
			title: '<button type="button" class="close mt-n1" data-dismiss="popover">&times;</button>' + (($label.length > 0) ? $label.html() : 'Date'),
			template: '<div id="' + input_id + '-picker-popover" class="popover datepicker-popover bs-popover-' + placement + '" role="tooltip" style="width:' + input_options.popoverWidth + ';"><div class="arrow"></div><h3 class="popover-header"></h3><div id="' + input_id + '-popover-body" class="popover-body border-bottom"></div><div class="popover-footer bg-light text-right px-3 py-2 rounded-lg" hidden="hidden"><button type="button" class="btn btn-secondary btn-sm" title="Close the picker" data-dismiss="popover"><i class="fas fa-times"></i> Close</button></div></div>',
			trigger: (($toggles.length > 0) ? 'manual' : 'click'),
			popperConfig: {
/*
				modifiers: {
					hide: {
						enabled: false
					},
					preventOverflow: {
						enabled: false,
//						boundariesElement: 'window',
						escapeWithReference: true
					}
				},
//				positionFixed: true
*/
			},
			content: function () {
				const options = $input.data('options');
				let viewDate = parseDate($input.val(), options) || dayjs();
				if (options.minDate && viewDate.isBefore(options.minDate, 'date'))
				{
					viewDate = options.minDate;
				}
				else if (options.maxDate && viewDate.isAfter(options.maxDate, 'date'))
				{
					viewDate = options.maxDate;
				}
				$input.data('viewdate', viewDate);
				return '<div id="' + input_id + '-picker-content"></div>';
			}
		});
		$toggles.on('click', function () {
			$input.popover('toggle');
			this.blur();
		});
	});
};

/**
 * Default options
 *
 * @type {object}
 */
jQuery.fn.datepicker.defaults = {
	format: 'MM/DD/YYYY',
	maxDate: null,
	minDate: '1900-01-01',
	popoverWidth: '19rem',
	startView: 'day',
	scheme: 'light'
};

/*
 * Initialize datepickers
 */
document.addEventListener('DOMContentLoaded', function() {
	jQuery('[data-toggle="datepicker"][data-target]').each(function () {
		jQuery(jQuery(this).data('target')).datepicker();
	});
});

//-------------------------------------
}());
