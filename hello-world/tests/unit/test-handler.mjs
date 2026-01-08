'use strict';

import { lambdaHandler, ehDocumentoValido } from '../../app.mjs';
import { expect } from 'chai';
var event, context;

describe('Tests index', function () {
    // it('verifies successful response', async () => {
    //     const result = await lambdaHandler(event, context)

    //     expect(result).to.be.an('object');
    //     expect(result.statusCode).to.equal(200);
    //     expect(result.body).to.be.an('string');

    //     let response = JSON.parse(result.body);

    //     expect(response).to.be.an('object');
    //     expect(response.message).to.be.equal("hello world");
    // });

    it('a funcao ehDocumentoValido(...) retorna true para um documento informado corretamente', () => {
        const res = ehDocumentoValido('03364266239')

        expect(res).to.be.true
    })

    it('a funcao ehDocumentoValido(...) retorna false para um documento informado incorretamente', () => {
        const res = ehDocumentoValido('12345678901')

        expect(res).to.be.false
    })

    it('a funcao ehDocumentoValido(...) retorna false quando algo que nao eh um documento for informado', () => {
        const res = ehDocumentoValido(undefined)

        expect(res).to.be.false
    })
});
