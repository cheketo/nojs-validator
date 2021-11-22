
class NoJsValidateElement
{
    validationText = '';
    validateOn = ['change'];
    validations = ['empty','max-length','min-length','integer','numeric','max-value','min-value','email','checked','equal-to-field','function'];
    beforeValidateEvent = new CustomEvent('beforeValidate');
    afterValidateEvent = new CustomEvent('afterValidate');
    afterValidateTrueEvent = new CustomEvent('afterValidateTrue');
    afterValidateFalseEvent = new CustomEvent('afterValidateFalse');

    constructor(element)
    {
        this.validations = ['empty','max-length','min-length','integer','numeric','max-value','min-value','email','checked','equal-to-field','function'];
        this.beforeValidateEvent = new CustomEvent('beforeValidate');
        this.afterValidateEvent = new CustomEvent('afterValidate');
        this.afterValidateTrueEvent = new CustomEvent('afterValidateTrue');
        this.afterValidateFalseEvent = new CustomEvent('afterValidateFalse');
        this.element = element;
        this.setValidateOn();
        this.setValidateEvents();
    }
    setValidateOn()
    {
        this.validateOn = ['change'];
        if(this.element.hasAttribute('validate-on'))
        {
            this.validateOn = this.element.getAttribute('validate-on').split(',');
        }
        this.validateOn.forEach(function(event)
        {
            this.element.addEventListener(event,this.validateElement,false);
        }.bind(this));
    }
    setValidateEvents()
    {
        if(this.element.hasAttribute('validate-before'))
        {
            var fn = this.element.getAttribute('validate-before');
            this.element.addEventListener('beforeValidate', window[fn], false);
        }
        if(this.element.hasAttribute('validate-after'))
        {
            var fn = this.element.getAttribute('validate-after');
            this.element.addEventListener('afterValidate', window[fn], false);
        }
        if(this.element.hasAttribute('validate-after-true'))
        {
            var fn = this.element.getAttribute('validate-after-true');
            this.element.addEventListener('afterValidateTrue', window[fn], false);
        }
        if(this.element.hasAttribute('validate-after-false'))
        {
            var fn = this.element.getAttribute('validate-after-false');
            this.element.addEventListener('afterValidateFalse', window[fn], false);
        }
    }
    capitalize(string)
    {
        var newString = '';
        string.split('-').forEach(function(word)
        {
            word = word.charAt(0).toUpperCase() + word.slice(1);
            newString = newString + word;
        }.bind(newString));
        return newString;
    }
    validateElement(event)
    {
        event.target.validate.isValid();
    }
    isValid()
    {
        this.validationText = '';
        this.element.dispatchEvent(this.beforeValidateEvent);
        var isValid = this.validations.every(function(validation)
        {
            if(this.element.hasAttribute('validate-'+validation))
            {
                return this['validate'+this.capitalize(validation)]();
            }
            return true;
        }.bind(this));
        this.validateAfter(isValid);
        return isValid;
    }
    validateAfter(isValid)
    {
        this.element.dispatchEvent(this.afterValidateEvent);
        if(isValid)
        {
            this.element.dispatchEvent(this.afterValidateTrueEvent);
        }else{
            this.element.dispatchEvent(this.afterValidateFalseEvent);
        }
    }
    validateFunction()
    {
        if(this.element.hasAttribute('validate-function'))
        {
            var functions = this.element.getAttribute('validate-function').split(',');
            return functions.every(function(fn)
            {
                if(fn)
                {
                    if (typeof window[fn] === 'function')
                    {
                        var result = window[fn](this.element);
                        if(!result && this.element.hasAttribute('validate-function-' + fn + '-msg'))
                        {
                            this.validationText = this.element.getAttribute('validate-function-' + fn + '-msg');
                        }
                        return result;
                    }else{
                        console.log('Function ' + fn + ' does not exists. You need to create it.');
                        return false;
                    }
                }else{
                    console.log('You need to set a function at validate-function attribute for field ' + this.element.getAttribute('id'));
                    return false;
                }
            }.bind(this));
        }
        return true;
    }
    validateEmpty()
    {
        var isValid = this.element.value != '' && this.element.value != undefined;
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-empty');
        return isValid;
    }
    validateMaxLength()
    {
        var maxLength = parseInt(this.element.getAttribute('validate-max-length'));
        var isValid = this.element.value.length <= maxLength;
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-max-length-msg');
        return isValid;
    }
    validateMinLength()
    {
        var minLength = parseInt(this.element.getAttribute('validate-min-length'));
        var isValid = this.element.value.length >= minLength;
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-min-length-msg');
        return isValid;
    }
    validateMaxValue()
    {
        var maxValue = this.element.getAttribute('validate-max-value');
        var isValid = this.element.value <= maxValue;
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-max-value-msg');
        return isValid;
    }
    validateMinValue()
    {
        var minValue = this.element.getAttribute('validate-min-value');
        var isValid = this.element.value >= minValue;
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-min-value-msg');
        return isValid;
    }
    validateString()
    {
        var isValid = isNaN(parseFloat(this.element.value));
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-string');
        return isValid;
    }
    validateNumeric()
    {
        var isValid = !isNaN(parseFloat(this.element.value)) && isFinite(this.element.value);
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-numeric');
        return isValid;
    }
    validateInteger()
    {
        var isValid = Number.isInteger(parseInt(this.element.value));
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-numeric');
        return isValid;
    }
    validateEmail()
    {
        var isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( this.element.value );
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-email');
        return isValid;
    }
    validateChecked()
    {
        var isValid = true;
        if(this.element.type.toLowerCase() == 'radio')
        {
            isValid = this.validateCheckedRadio();
        }else{
            if(this.element.type.toLowerCase() == 'checkbox')
            {
                isValid = this.validateCheckedCheckbox();
            }
        }
    }
    validateCheckedRadio()
    {
        var name = this.element.getAttribute('name');
        var isValid = document.getElementsByName(name).some(function(radio)
        {
            return radio.checked == true && radio.type.toLowerCase() == 'radio';
        });
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-checked');
        return isValid;
    }
    validateCheckedCheckbox()
    {
        var name = this.element.getAttribute('name');
        var checked = document.getElementsByName(name).filter(function(checkbox)
        {
            return checkbox.checked == true && checkbox.type.toLowerCase() == 'checkbox';
        }).length;
        var target = parseInt(this.element.getAttribute('validate-checked'));
        var isValid = false;
        if(isNaN(target))
        {
            var mode;
            if(this.element.hasAttribute('validate-checked-mode'))
            {
                mode = this.element.getAttribute('validate-checked-mode');
            }
            switch(mode)
            {
                case 'max': isValid = checked <= target; break;
                case 'equal': isValid = checked == target; break;
                default: isValid = checked >= target; break;
            }
        }else{
            console.log('Attribute validate-checked must be an integer number');
            return false;
        }
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-checked-msg');
        return isValid;
    }
    validateEqualToField()
    {
        var field = document.getElementById(this.element.getAttribute('validate-equal-to-field'));
        var isValid = false;
        if(field && field != undefined)
        {
            isValid = this.element.value == field.value;
        }else{
            console.log('Attribute validate-equal-to-field must be an id of a field');
            return isValid;
        }
        if(!isValid)
            this.validationText = this.element.getAttribute('validate-equal-to-field-msg');
    }
}

class NoJsValidator
{
    mainClass = '';
    elementTags = ['input','select','textarea'];
    elements = [];
    forms = [];
    events = {};
    validateOn = '';
    constructor( obj = {} )
    {
        this.elements = [];
        this.setMainClass(obj.mainClass);
        this.setElementTags(obj.elements);
        this.setForms(obj.forms);
        this.setValidationEvents(obj.events);
        this.setValidateOn(obj.validateOn);
        this.setElements();
    }
    setMainClass(mainClass=null)
    {
        // if(mainClass)
        // {
            this.mainClass = mainClass;
        // }
    }
    setForms(forms=[])
    {
        forms.forEach(function(form)
        {
            var newForm = document.forms.namedItem(form);
            if(newForm)
            {
                this.forms = this.forms.concat(newForm);
            }
        }.bind(this));
    }
    setElementTags(tags=['input','select','textarea'])
    {
        // if(tags.length)
        // {
            this.elementTags = tags;
        // }
    }
    setValidationEvents(events={})
    {
        // if(events)
            this.events = events;
    }
    setValidateOn(validateOn='')
    {
        // if(validateOn)
            this.validateOn = validateOn;
    }
    setElements()
    {
        if(this.forms.length)
        {
            this.setElementsByForms();
        }else{
            this.setElementsByTags();
        }
    }

    setElementsByForms()
    {
        this.forms.forEach(function(form)
        {
            for (let index = 0; index < form.length; index++)
            {
                if(this.elementTags.indexOf(String(form[index].tagName).toLowerCase()) != -1)
                {
                    this.pushElement(form[index]);
                }
            }
        }.bind(this));
    }
    setElementsByTags()
    {
        this.elementTags.forEach(function(tag)
        {
            var elements = document.getElementsByTagName(tag);
            for (let index = 0; index < elements.length; index++)
            {
                this.pushElement(elements[index]);
            }
        }.bind(this));
    }
    pushElement(element)
    {
        if(!this.mainClass || element.classList.contains(this.mainClass))
        {
            if(this.events.before && !element.hasAttribute('validate-before')) element.setAttribute('validate-before',this.events.before);
            if(this.events.after && !element.hasAttribute('validate-after')) element.setAttribute('validate-after',this.events.after);
            if(this.events.afterTrue && !element.hasAttribute('validate-after-true')) element.setAttribute('validate-after-true',this.events.afterTrue);
            if(this.events.afterFalse && !element.hasAttribute('validate-after-false')) element.setAttribute('validate-after-false',this.events.afterFalse);
            if(this.validateOn && !element.hasAttribute('validate-on')) element.setAttribute('validate-on',this.validateOn);
            element.validate = new NoJsValidateElement(element);
            this.elements = this.getElements().concat(element);
        }
    }
    getElements()
    {
        return this.elements;
    }
    showElements()
    {
        console.log(this.getElements());
    }
    isValid()
    {
        var isValid = this.elements.filter(function(element)
        {
            return element.validate.isValid();
        }).length == this.elements.length;
        return isValid;
    }
}

module.exports = {NoJsValidateElement, NoJsValidator};