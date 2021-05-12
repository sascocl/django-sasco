/*! SowerPHP | (c) 2014 SowerPHP | AGPL3+ */
/*jslint browser: true, devel: true, nomen: true, indent: 4 */

/**
 * Constructor de la clase
 */
function Form() {
    'use strict';
    return;
}

/**
 * Método que crea un un mensaje de carga del formulario usando bootbox
 * @param message Mensaje que se desea mostrar al usuario
 */
Form.loading = function(message) {
    if (typeof message === 'undefined') {
        message = 'Cargando...';
    }
    bootbox.dialog({
        message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> ' + message + '</div>',
        centerVertical: true,
        closeButton: false
    });
    return true;
}

/**
 * Método que crea una alerta usando bootbox
 * @param message Mensaje que se desea mostrar al usuario
 * @param e Elemento al que se debe poner el foco después
 */
Form.alert = function (message, e) {
    var box = bootbox.alert({
        title: '<i class="fas fa-exclamation-circle fa-fw text-danger"></i> Ocurrió un problema',
        message: message,
        locale: 'en',
        backdrop: true
    });
    if (typeof e !== 'undefined') {
        box.on('hidden.bs.modal',function(){
            e.focus();
        });
    }
}

/**
 * Método que crea una dialogo de confirmación usando bootbox
 * @param objeto Objeto (form o a) que se está confirmando (permite confirmar y continuar)
 * @param message Mensaje que se desea mostrar al usuario
 */
Form.confirm = function (objeto, message, loading) {
    message = message || "¿Está seguro que desea enviar el formulario?"
    bootbox.confirm({
        title: '<i class="fas fa-question-circle fa-fw text-warning"></i> Se requiere confirmación',
        message: message,
        locale: 'es',
        backdrop: true,
        buttons: {
            confirm: {
                className: 'btn-success'
            },
            cancel: {
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                if (typeof loading !== 'undefined') {
                    Form.loading(loading);
                }
                if (objeto.tagName.toUpperCase() == 'FORM') {
                    objeto.removeAttribute('onsubmit');
                    if (typeof objeto.submit == 'function') {
                        objeto.submit();
                    }
                    else if (typeof objeto.submit.click != 'undefined') {
                        objeto.submit.click();
                    }
                    else {
                        console.log('No fue posible confirmar la acción');
                    }
                }
                else if (objeto.tagName.toUpperCase() == 'A') {
                    window.location = objeto.href;
                }
            }
        }
    });
    return false;
}

/**
 * Método que permite agrandar un campo de texto para poder ver mejor su contenido
 * @param field Campo de texto que se desea agrandar
 */
Form.growup = function(field) {
    bootbox.prompt({
        title: 'Editar campo: ' + field.name.replace('[]',''),
        inputType: 'textarea',
        value: field.value,
        rows: 5,
        backdrop: true,
        centerVertical: true,
        buttons: {
            confirm: {
                label: 'Guardar cambios',
                className: 'btn-success'
            },
            cancel: {
                label: 'Cancelar',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result !== null) {
                if ($(field).attr('maxlength')===undefined) {
                    field.value = result;
                } else {
                    field.value = result.substring(0, $(field).attr('maxlength'));
                }
            }
        }
    });
}

/**
 * Método que revisa que el campo no sea vacío
 * @param Campo que se quiere validar
 * @return =true pasó la validación ok
 */
Form.check_notempty = function (field) {
    'use strict';
    if (__.empty(field.value)) {
        return "¡%s no puede estar en blanco!";
    }
    return true;
};

/**
 * Método que revisa que el campo sea un entero
 * @param Campo que se quiere validar
 * @return =true pasó la validación ok
 */
Form.check_integer = function (field) {
    'use strict';
    if (!__.isInt(field.value)) {
        return "¡%s debe ser un número entero!";
    }
    field.value = parseInt(field.value);
    return true;
};

/**
 * Método que revisa que el campo sea un número real (entero o decimal)
 * @param Campo que se quiere validar
 * @return =true pasó la validación ok
 */
Form.check_real = function (field) {
    'use strict';
    if (Form.check_integer(field)===true) {
        return true;
    }
    field.value = field.value.replace(',', '.');
    if (!__.isFloat(field.value)) {
        return "¡%s debe ser un número entero o decimal con punto!";
    }
    field.value = parseFloat(field.value);
    return true;
};

/**
 * Método que revisa que el campo sea un correo electrónico
 * @param Campo que se quiere validar
 * @return =true pasó la validación ok
 */
Form.check_email = function (field) {
    'use strict';
    var filter, emails, i;
    filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(field.value)) {
        return "¡%s no es válido!";
    }
    return true;
};

/**
 * Método que revisa que el campo sea uno o varios correos electrónicos
 * @param Campo que se quiere validar
 * @return =true pasó la validación ok
 */
Form.check_emails = function (field) {
    'use strict';
    var filter, emails, i;
    filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    field.value = field.value.replace(/ /g, "");
    emails = field.value.replace(/\n/g, ";").replace(/,/g, ";").split(';');
    for (i = 0; i < emails.length; i=i+1) {
        if (!filter.test(emails[i])) {
            return "¡%s no es válido!";
        }
    }
    return true;
};

/**
 * Método que revisa que el campo sea una fecha en formato YYYY-MM-DD
 * @param Campo que se quiere validar
 * @return =true pasó la validación ok
 */
Form.check_date = function (field) {
    'use strict';
    var filter = /^\d{4}[\-](0?[1-9]|1[012])[\-](0?[1-9]|[12][0-9]|3[01])$/;
    if (!filter.test(field.value)) {
        return "¡%s debe estar en formato AAAA-MM-DD!";
    }
    return true;
};

/**
 * Método que revisa que el campo sea un número de teléfono en formato:
 * "+<código país> <prefijo> <teléfono>"
 * Ejemplos válidos: +56 9 87654321 o +56 2 22221111 o +56 72 2222111
 * @warning En la práctica solo serviría para validar teléfono con el formato usado en Chile
 * @param Campo que se quiere validar
 * @return =true pasó la validación ok
 */
Form.check_telephone = function (field) {
    'use strict';
    var filter = /^\+\d{1,4}[ ]([1-9]{1}|\d{1,2})[ ]\d{7,8}$/;
    if (field.value[0]!='+')
        field.value = '+' + field.value;
    if (!filter.test(field.value)) {
        return "¡%s debe tener el formato +<código país> <prefijo> <teléfono>!\nEjemplo: +56 9 87654321 o +56 2 22221111";
    }
    return true;
};

/**
 * Método que revisa que el campo sea un RUT válido
 * @param Campo que se quiere validar
 * @return =true pasó la validación ok
 */
Form.check_rut = function (field) {
    'use strict';
    var dv = field.value.charAt(field.value.length - 1).toUpperCase(),
        rut = field.value.replace(/\./g, "").replace("-", "");
    if (dv !== "K")
        dv = parseInt(dv);
    rut = rut.substr(0, rut.length - 1);
    if (dv !== __.rutDV(rut)) {
        return "¡%s es incorrecto!";
    }
    field.value = __.num(rut) + "-" + dv;
    return true;
};

/**
 * Método principal que hace los chequeos:
 *   - Campo obligatorio (en caso de aplicar)
 *   - Tipo de dato del campo
 * @param id ID del formulario o nada si se desean revisar todos los campos
 * @return =true pasó la validación ok
 */
Form.check = function (id) {
    'use strict';
    var fields, i, j, checks, status, label;
    // seleccionar campos que se deben chequear
    if (id !== undefined) {
        try {
            fields = document.getElementById(id).getElementsByClassName("check");
        } catch (error) {
            fields = [];
        }
    } else {
        fields = document.getElementsByClassName("check");
    }
    // chequear campos
    for (i = 0; i < fields.length; i += 1) {
        fields[i].parentNode.parentNode.className = fields[i].parentNode.parentNode.className.replace(/(?:^|\s)has-error(?!\S)/g, '');
        if ($(fields[i]).prop('disabled')) {
            continue;
        }
        try {
            fields[i].value = fields[i].value.trim();
        } catch (error) {}
        checks = fields[i].getAttribute("class").replace("check ", "").split(" ");
        if (checks.indexOf("notempty") === -1 && __.empty(fields[i].value)) {
            continue;
        }
        for (j = 0; j < checks.length; j += 1) {
            if (checks[j] === "" || Form["check_" + checks[j]] === undefined) {
                continue;
            }
            try {
                status = Form["check_" + checks[j]](fields[i]);
                if (status !== true) {
                    if (fields[i].parentNode.parentNode.getElementsByTagName("label").length)
                        label = fields[i].parentNode.parentNode.getElementsByTagName("label")[0].textContent.replace("* ", "");
                    else if (!__.empty(fields[i].placeholder))
                        label = fields[i].placeholder;
                    else
                        label = fields[i].name;
                    fields[i].parentNode.parentNode.className += " has-error";
                    Form.alert(status.replace("%s", label), fields[i]);
                    try {
                        fields[i].select();
                    } catch (error) {
                    }
                    fields[i].focus();
                    return false;
                }
            } catch (error) {
                console.log("Error al ejecutar el método %s: ".replace("%s", "Form.check_" + checks[j]) + error);
            }
        }
    }
    // retornar estado final
    return true;
};

/**
 * Método para agregar una fila a una tabla en un formulario
 * @param id ID de la tabla donde se deben agregar los campos
 */
Form.addJS = function (id, trigger, callback) {
    'use strict';
    document.getElementById(id).getElementsByTagName("tbody")[0].insertAdjacentHTML('beforeend', window["inputsJS_" + id]);
    if (trigger != undefined) {
        trigger.parentNode.parentNode.nextSibling.firstChild.firstChild.firstChild.focus();
    }
    if (callback != undefined) {
        callback(document.getElementById(id).getElementsByTagName("tbody")[0].lastChild);
    }
};

/**
 * Método para eliminar una fila de una tabla en un formulario
 * @param link Elemento link (<a>) que es parte de la fila que se desea remover
 */
Form.delJS = function (link) {
    'use strict';
    link.parentNode.parentNode.remove();
};

/**
 * Método para cambiar el valor de un grupo de checkboxes de un mismo nombre
 * @param name Nombre del arreglo de checkboxes que se desea asignar un valor "check"
 * @param checked Si se deben o no marcar como chequeados los checkboxes
 */
Form.checkboxesSet = function (name, checked) {
    'use strict';
    var checkboxes, i;
    checkboxes = document.querySelectorAll("input[name='"+name+"[]']");
    for (i = 0; i < checkboxes.length; i += 1) {
        checkboxes[i].checked = checked;
    }
};

/**
 * Método que remueve los tags <option> de un tag <select>
 * @param selectbox Elemento select que se quiere limpiar
 * @param from Desde que option limpiar el campo select
 * @author Esteban De La Fuente Rubio, DeLaF (esteban[at]delaf.cl)
 * @version 2014-04-09
 */
Form.removeOptions = function (selectbox, from) {
    'use strict';
    var i;
    from = from || 0;
    for (i = selectbox.options.length - 1; i >= from; i -= 1) {
        selectbox.remove(i);
    }
};

/**
 * Método que agrega los tags <option> de un tag <select> usando un listado de opciones
 * @param selectID identificador del <select> que se desea modificar
 * @param opciones_listado Objeto JSON con las opciones indexadas por una categoría superior
 * @param seleccionada Categoría superior seleccionada de la cual se quieren cargar las opciones
 * @author Esteban De La Fuente Rubio, DeLaF (esteban[at]delaf.cl)
 * @version 2017-03-22
 */
Form.addOptions = function (selectID, opciones_listado, seleccionada, dejar) {
    'use strict';
    var i, option, opciones;
    if (dejar == undefined) dejar = 1;
    Form.removeOptions(document.getElementById(selectID), dejar);
    document.getElementById(selectID).removeAttribute("disabled");
    opciones = seleccionada ? opciones_listado[seleccionada] : opciones_listado;
    if (opciones === undefined) {
        document.getElementById(selectID).setAttribute("disabled", "disabled");
        return;
    }
    if (opciones instanceof Array == false) {
        opciones = [opciones];
    }
    for (i = 0; i < opciones.length; i += 1) {
        option = document.createElement("option");
        option.setAttribute("value", opciones[i].id);
        option.textContent = opciones[i].glosa;
        document.getElementById(selectID).appendChild(option);
    }
};

/**
 * Método que permite actualizar de manera dinámica las filas de una tabla de
 * checkboxes.
 * @param selectID identificador del tag <table> que se desea modificar
 * @param nombre Nombre del checkbox (se agregarán los [])
 * @param opciones_listado Objeto JSON con las opciones indexadas por una categoría superior
 * @param seleccionada Categoría superior seleccionada de la cual se quieren cargar las opciones
 * @param keys Atributos del objeto JSON que corresponden a la clave de la fila
 * @param cols Atributos del objeto JSON que se desea mostrar como columnas en la tabla
 * @param dejar Cantidad de filas desde el inicio que se deben dejar al actualizar (por defecto 0)
 * @author Esteban De La Fuente Rubio, DeLaF (esteban[at]delaf.cl)
 * @version 2017-03-23
 */
Form.updateTablecheck = function (selectID, nombre, opciones_listado, seleccionada, keys, cols, dejar) {
    var tbody, i, j, opciones, tr, td, key, input;
    if (dejar == undefined) dejar = 0;
    tbody = document.getElementById(selectID).tBodies[0];
    for (i = tbody.childElementCount - 1; i > dejar-1; i = i - 1) {
        tbody.childNodes[i].remove();
    }
    opciones = seleccionada ? opciones_listado[seleccionada] : opciones_listado;
    if (opciones == undefined)
        return;
    if (opciones instanceof Array == false) {
        opciones = [opciones];
    }
    for (i = 0; i < opciones.length; i += 1) {
        tr = document.createElement("tr");
        for (j = 0; j < cols.length; j += 1) {
            td = document.createElement("td");
            td.textContent = opciones[i][cols[j]];
            tr.appendChild(td);
        }
        key = new Array();
        for (j = 0; j < keys.length; j += 1) {
            key[j] = opciones[i][keys[j]];
        }
        key = key.join(";");
        td = document.createElement("td");
        input = document.createElement("input");
        input.type = "checkbox";
        input.name = nombre + "[]";
        input.value = key;
        td.appendChild(input);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
};

/**
 * Función para enviar un formulario por POST
 * @param url URL donde se debe enviar el formulario
 * @param variables Hash json con las variables a pasar al formulario
 * @param newWindow Si está asignado se abrirá el formulario en una nueva ventana
 * @author Esteban De La Fuente Rubio, DeLaF (esteban[at]delaf.cl)
 * @version 2014-04-29
 */
Form.post = function (url, variables, newWindow) {
    'use strict';
    var form, hiddenField, variable;
    form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", url);
    if (newWindow !== undefined) {
        form.setAttribute("target", "_blank");
    }
    for (variable in variables) {
        if (variables.hasOwnProperty(variable)) {
            hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", variable);
            hiddenField.setAttribute("value", variables[variable]);
            form.appendChild(hiddenField);
        }
    }
    hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "submit");
    hiddenField.setAttribute("name", "enviar");
    hiddenField.setAttribute("value", "Enviar");
    form.appendChild(hiddenField);
    form.submit();
}
