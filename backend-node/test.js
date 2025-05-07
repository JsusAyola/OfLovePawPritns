const { predict } = require('./helpers/wekaService');

(async () => {
    const result = await predict('data/archivo.arff');
    console.log(result);
})();
