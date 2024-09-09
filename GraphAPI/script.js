//URL Base
const base_url = ('https://brapi.dev/api')


//Chave da API
const apiToken = ('')

//=====================<Configurações da lista de fiis>=======================
var list=document.getElementById('lista')

for (i=0; i<8; i++){

    var li_create = document.createElement('li')
    li_create.id = ('list_li_'+[i])
    var div_create = document.createElement('div')
    div_create.id=('img_fii1')
    var p_create = document.createElement('p')
    p_create.innerHTML=('Fundo Indisponivel')
    list.appendChild(li_create)
    li_create.appendChild(div_create)
    li_create.appendChild(p_create)

}


const itens=list.getElementsByTagName('p')
const images=list.getElementsByTagName('div')
const list_elem = list.getElementsByTagName('li')
var contagem_itens=(itens.length)
var contagem_images=(images.length)

//=====================</Configurações da lista de fiis>=======================

let myChart

async function minhaFuncao(event) {
    window.scrollTo(0, 0)
    const local = (event.currentTarget);
    const local1 = local.getElementsByTagName('p')
    teste = document.getElementById('fii_name')
    teste.innerHTML=(local1[0].innerHTML)
    var fiis_name = local.getAttribute('name')
    var URL_dados = (base_url+'/quote/'+fiis_name+'?token='+apiToken)


    const api_dados = await fetch(URL_dados)


    if (api_dados.status === 200){
        

        //=======================<Config da data>=============================

        var agora = new Date();
        var dataHoraAtual = agora.toLocaleString();
        document.getElementById('data_request').innerHTML=(dataHoraAtual)

        //=======================</Config da data>============================


        //=======================<Requisições e exibição>================================
        const api_dados_a = await api_dados.json()

        var logourl = api_dados_a.results[0].logourl
        var valor_atual = api_dados_a.results[0].regularMarketPrice
        var variacao = api_dados_a.results[0].regularMarketChangePercent ?? 0;
        var min_dia = api_dados_a.results[0].regularMarketDayLow 
        var max_dia = api_dados_a.results[0].regularMarketDayHigh 
        var abert = api_dados_a.results[0].regularMarketOpen 
        var lucro = api_dados_a.results[0].priceEarnings ?? 0;
        
        valor_atual = valor_atual.toFixed(2);
        variacao = variacao.toFixed(2);
        min_dia = min_dia.toFixed(2);
        max_dia = max_dia.toFixed(2);
        abert = abert.toFixed(2); 
        lucro = lucro.toFixed(2); 

        document.getElementById('img_name').style.backgroundImage=`url(${logourl})`
        document.getElementById('regularMarketPrice').innerHTML=('R$ ' +valor_atual)
        document.getElementById('regularMarketChangePercent').innerHTML=(variacao + ' %')
        document.getElementById('regularMarketDayLow').innerHTML=('R$ ' +min_dia)
        document.getElementById('regularMarketDayHigh').innerHTML=('R$ ' +max_dia)
        document.getElementById('regularMarketOpen').innerHTML=('R$ ' +abert)
        document.getElementById('priceEarnings').innerHTML=('R$ ' +lucro)
        
        //=======================</Requisições e exibição>================================

        //=======================<Config do grafico>======================================
        if (myChart) {
            myChart.data.datasets[0].data = [abert, min_dia, max_dia, valor_atual];
            myChart.update();
        }
        else{
            const ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, 
        {
        type: 'line',
        data: {
            labels: ['Abertura', 'Min. dia', 'Max. dia', 'Atual'],
            datasets: [{
            label: 'Cotação do fundo imobiliario',
            data: [abert, min_dia, max_dia, valor_atual],
            backgroundColor: ['rgba(15, 120, 196, 0.2)',],
            borderColor: ['rgba(15, 120, 196, 1)',],
            borderWidth: 1
            }]
        },
        options: {scales: {y: {beginAtZero: false}}}
        });
        }
        //=======================</Config do grafico>======================================
    }
    

}

for (i=0; i<contagem_itens; i++){
    list.children[i].addEventListener('click', minhaFuncao)
}


//================<Função responsavel por conectar a API>==============================
async function connectApi() {

    var fundo = ('')
    const fiisList = []
    var status_list = document.getElementById('status_list')
    
    var URL_fiis = (base_url+'/available?search=TR&token='+apiToken)
    const api = await fetch(URL_fiis)
    console.log(api)
    

    if (api.status === 200){
        
        //=========================<Indicador de conexão>========================

        function api_connection_test(){
            if(api.status === 200 && apiToken!=''){
                var li_create = document.createElement('li')
                status_list.append(li_create)

                var div_create = document.createElement('div')
                div_create.id = ('img_status')
                div_create.style.backgroundImage=`url('/src/affirmative.svg')`

                var p_create = document.createElement('p')
                p_create.innerText=('Conexão com a API')

                li_create.appendChild(div_create)
                li_create.appendChild(p_create)
            }
            else{
                var li_create = document.createElement('li')
                status_list.append(li_create)

                var div_create = document.createElement('div')
                div_create.id = ('img_status')
                div_create.style.backgroundImage=`url('/src/negative.svg')`

                var p_create = document.createElement('p')
                p_create.innerText=('Sem conexão com a API')

                li_create.appendChild(div_create)
                li_create.appendChild(p_create)
            }
    
        }
        //=========================</Indicador de conexão>========================
        
        api_connection_test()

        //=======================<Requisições e exibição>================================

        const object = await api.json()

        for (i=0; i<contagem_itens; i++){
            fiisList.push(object.stocks[i])
            fundo = fiisList[i]
            var URL_dados = (base_url+'/quote/'+fundo+'?token='+apiToken)
            const api_name = await fetch(URL_dados)

            if (api_name.status === 200){
                var dados = await api_name.json()
                var collect_logos = dados.results[0].logourl
                var collect_shortname = dados.results[0].shortName
                var collect_symbol = dados.results[0].symbol
                images[i].style.backgroundImage=`url(${collect_logos})`
                itens[i].innerText=(fundo+' - '+collect_shortname)
                list_elem[i].setAttribute('name', collect_symbol );

            }     
           }
        //=======================</Requisições e exibição>================================
        
    }
  
}

//================</Função responsavel por conectar a API>==============================


connectApi()

