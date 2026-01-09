import dotenv from 'dotenv'

dotenv.config()

const API = "http://afd84b639300541a4bf15735aefc63fd-2096295087.us-east-2.elb.amazonaws.com/api"

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

/**
 * @param {string} d O documento que sera validado
 * @returns {boolean} true para documento valido, false para documento invalido
*/
export function ehDocumentoValido(d) {
    if (!d) return false;

    // Remove tudo que nao for numero
    const cpf = String(d).replace(/\D/g, '');

    //  Precisa ter exatamente 11 digitos
    if (cpf.length !== 11) return false;

    // Rejeita CPFs com todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validacao do primeiro digito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }

    let firstDigit = (sum * 10) % 11;
    if (firstDigit === 10) firstDigit = 0;

    if (firstDigit !== parseInt(cpf[9])) return false;

    // Validacao do segundo digito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }

    let secondDigit = (sum * 10) % 11;
    if (secondDigit === 10) secondDigit = 0;

    if (secondDigit !== parseInt(cpf[10])) return false;

    // valido
    return true;
}

export const lambdaHandler = async (event, context) => {
    if (typeof event.body === undefined) {
        return {
            statusCode: 400,
            body: {
                err: true,
                msg: 'Invalid request body'
            }
        };
    }

    const body = JSON.parse(event.body);

    // * valida o documento do cliente

    if (body.act === 'ACT_VALIDATE_USER_DOCUMENT') {
        let doc = body.data;

        let valido = ehDocumentoValido(doc);

        return {
            statusCode: valido ? 200 : 400,
            body: JSON.stringify({
                err: valido ? false : true,
                msg: valido ? 'status: validated' : 'status: invalid',
                data: {
                    doc
                }
            })
        }
    }

    // * consulta a existencia e o status do cliente na base de dados

    if (body.act === 'ACT_VALIDATE_CUSTOMER_STATUS') {
        let documentoCliente = body.data;

        if (ehDocumentoValido(documentoCliente) === false) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    err: true,
                    msg: 'invalid document'
                })
            }
        }

        let response = await fetch(API.concat('/cliente/status?d=', documentoCliente.replace(/\D/g, '')))

        if (response.status !== 200) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    err: true,
                    msg: 'failed to validate customer status'
                })
            }
        }

        const resData = await response.json()

        return {
            statusCode: 200,
            body: JSON.stringify(resData)
        }
    }

    // * gera um token JWS para acessar os recursos da api de oficina mecanica

    if (body.act === 'ACT_GENERATE_TOKEN') {
        let email = body.data.email;
        let password = body.data.password;

        let response = await fetch(API.concat('/auth/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                senha: password
            }),
        })

        if (response.status !== 200) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    err: true,
                    msg: 'failed to generate token'
                })
            }
        }

        const resData = await response.json()

        return {
            statusCode: 200,
            body: JSON.stringify(resData)
        }
    }

    let finalRes = {
        statusCode: 200,
        body: JSON.stringify({
            err: true,
            msg: 'invalid action'
        })
    };

    return finalRes
};