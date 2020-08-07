# nojs-validator
## Description
This is a vanilla JS library that helps to automatize and reuse form validations using HTML input attributes to set rules. It's very easy to use and it will let you save validations coding time. **Do it once, use it forever!**

## Installation
Run this command at your terminal to install this library
```
$ npm i nojs-validator
```
 
---
 
## Validations
All validations are easy to use and all of them can be used just by including an attribute at the element that you want to validate. Right now, there are **11** validations:

| Validation | Description | Example |
| ------ | ------ | ------ |
|**EMPTY** | This validation checks if the field does not has a value using **validate-empty** attribute to set it. The value of that attribute can be used in a custom function to display it as text.| ` <input type="text" name="username" validate-empty="Enter an username"> `|
|**MAX LENGTH**|This validation checks if the field value has a length (in characters) higher than the one specified at **validate-max-length** attribute. You can set a text value for further use in **validate-max-length-msg** attribute.|` <input type="text" name="code" validate-max-length="10" validate-max-length-msg="Enter 10 characters or less">`|
|**MIN LENGTH**|This validation checks if the field value has a length (in characters) lower than the one specified at **validate-min-length** attribute. You can set a text value for further use in **validate-min-length-msg** attribute.|`<input type="text" name="name" validate-min-length="2" validate-max-length-msg="Enter 2 characters at least">`|
|**INTEGER**|Validates if the field value is an integer number using **validate-integer** attribute. The value of that attribute can be used in a custom function to display it as text.|`<input type="number" name="position" validate-integer="Please, enter an integer number">`|
|**NUMERIC**|Validates if the field value contains only number using **validate-numeric** attribute. The value of that attribute can be used in a custom function to display it as text.|`<input type="number" name="weight" validate-numeric="Please, enter a number">`|
|**MAX VALUE**|This validation checks if the field value is higher than the one specified at **validate-max-value** attribute. You can set a text value for further use in **validate-max-value-msg** attribute.|`<input type="number" name="price" validate-max-value="10" validate-max-value-msg="Only numbers lower than 10 allowed">`|
|**MIN VALUE**|This validation checks if the field value has a value (in characters) lower than the one specified at **validate-min-value** attribute. You can set a text value for further use in **validate-min-value-msg** attribute.|`<input type="number" name="cost" validate-min-value="5" validate-max-value-msg="You cannot enter numbers lower than 5">`|
|**EMAIL**|Validates if the field value is a valid email using **validate-email** attribute. The value of that attribute can be used in a custom function to display it as text.|`<input type="email" name="email" validate-email="Please, enter an email">`|
|**CHECKED**|This validation **only works for checkboxes and radio buttons**. For both input types checks if it is checked using **validate-checked** attribute.||
|**CHECKED** (Radio Button)|For radio buttons is very simple to use. Text error will be inside **validate-checked** attribute.|`<input type="radio" name="pet" value="dog" validate-checked="Please, choose a pet"><input type="radio" name="pet" value="cat" validate-checked="Please, choose a pet"> <input type="radio" name="pet" value="dog" validate-checked="Please, choose a pet">`|
|**CHECKED** (Checkboxes)|For checkboxes there are 3 ways to use it (**min, max or equal**) but in all of them you need to set **validate-checked** attribute with an **integer** value. You can define the way that you want to use it, using **validate-checked-mode** attribute. Text error can be defined using **validate-checked-msg** attribute.||
|**CHECKED** (Checkboxes - min mode)|Checks if the number of checked checkboxes are equal or higher than the value defined at **validate-checked** attribute. **min** mode will be set by default, if **valdiate-checked-mode** is not defined or is filled with other values.|`<input type="checkbox" name="foods" value="hamburguer" validate-checked="2" validate-checked-msg="Please, select 2 or more options"><input type="checkbox" name="foods" value="hotdog" validate-checked="2" validate-checked-msg="Please, select 2 or more options"><input type="checkbox" name="foods" value="fries" validate-checked="2" validate-checked-msg="Please, select 2 or more options">`|
|**CHECKED** (Checkboxes - max mode)|Checks if the number of checked checkboxes are equal or lower than the value defined at **validate-checked** attribute.|`<input type="checkbox" name="handweapons" value="sword" validate-checked="2" validate-checked-mode="max" validate-checked-msg="Up to 2 options can be checked"><input type="checkbox" name="handweapons" value="shield" validate-checked="2" validate-checked-mode="max" validate-checked-msg="Up to 2 options can be checked"><input type="checkbox" name="handweapons" value="wand" validate-checked="2" validate-checked-mode="max" validate-checked-msg="Up to 2 options can be checked">`|
|**CHECKED** (Checkboxes - equal mode)|Checks if the number of checked checkboxes are equal to value defined at **validate-checked** attribute.|`<input type="checkbox" name="accessories" value="glasses" validate-checked="2" validate-checked-mode="equal" validate-checked-msg="You must check 2 options"><input type="checkbox" name="accessories" value="headphones" validate-checked="2" validate-checked-mode="equal" validate-checked-msg="You must check 2 options"><input type="checkbox" name="accessories" value="cap" validate-checked="2" validate-checked-mode="equal" validate-checked-msg="You must check 2 options">`|
|**EQUAL TO FIELD**|This validation checks if the field value is equal to another field value. To use it, attribute *validate-equal-to-field* must be defined and filled with a field ID. Error text can be defined in *validate-equal-to-field-msg* attribute.|`<input type="text" name="user" validate-equal-to-field="author" validate-equal-to-field-msg="User must match author"><input type="text" name="author" id="author">`|

 
## Custom Validations
It's obvious that this validations are not enough to validate all cases. So, custom validations can be added. This is very simple to do, just add your validation functions to **validate-function** attribute. Example:
First, define a function to validate:
```
function testValidation(element)
{
    return element.value == 'test';
}
function anotherValidation(element)
{
    return element.type == 'text';
}
```
 
Then, functions has to be added at the **validate-function** attribute. A custom attribute with the function's name can be added to define an error text:
```
<input type="text" validate-function="testValidation,anotherValidation" validate-function-testValidation-msg="This is an error text for display when testValidation function returns false">
```
 
---
 
## Usage
Include **nojs-validator.js** file and create a new NoJsValidator object like this:
```
<script type="text/javascript" src="nojs-validator.js"></script>
<script type="text/javascript">
    var validator = new NoJsValidator();
</script>
```