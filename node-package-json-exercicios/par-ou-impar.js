const decisao = process.argv[2].toLowerCase();
const usuario = Number(process.argv[3]);

function geradorNumerico(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const computador = Number(geradorNumerico(0, 10))
const resultado = usuario + computador

if(decisao == 'par' && resultado % 2 == 0){console.log(`Você escolheu par com o número ${usuario} e o computador escolheu ímpar com o número ${computador}, resultado final ${resultado}, você venceu`)}
if(decisao == 'par' && resultado % 2 !== 0){console.log(`Você escolheu par com o número ${usuario} e o computador escolheu ímpar com o número ${computador}, resultado final ${resultado}, computador venceu!`)}
if(decisao == 'impar' && resultado % 2 == 0){console.log(`Você escolheu ímpar com o número ${usuario} e o computador escolheu par com o número ${computador}, resultado final ${resultado}, computador venceu!`)}
if(decisao == 'impar' && resultado % 2 !== 0){console.log(`Você escolheu ímpar com o número ${usuario} e o computador escolheu par com o número ${computador} resultado, final ${resultado}, você venceu`)}