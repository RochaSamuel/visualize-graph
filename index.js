const elem = document.getElementById('3d-graph');
const popup = document.getElementById('popup');

(async () => {
const getLinks = async () => {return await fetch('./linksv2.json').then(response => response.json()).then(json => json)};
const getNodes = async () => {return await fetch('./nodesv2.json').then(response => response.json()).then(json => json)};

console.log(getLinks)

const links = await getLinks();
const nodes = await getNodes();

console.log(links)
const data = {
    nodes: nodes,
    links: links
}

const Graph = ForceGraph3D()
(elem)
.graphData(data)
.nodeLabel('id')
.nodeAutoColorBy('group')
.onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
.onNodeClick(node => {
    console.log(node);
    console.log(typeof(node));
    const id = document.getElementById('d_id');
    const title = document.getElementById('title');
    const tamanho_disco = document.getElementById('colunas');
    const colunas = document.getElementById('espaco');
    const button = document.getElementById('nice_button');
    id.innerHTML = `<b>id:</b>${node.id}`;
    title.innerText = node.title;
    tamanho_disco.innerText = node.tamanho_disco;
    colunas.innerText = node.colunas;
    button.href = node.link;
    popup.style.display = 'block';
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    
    Graph.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000  // ms transition duration
        );
})
.linkThreeObjectExtend(true)
.linkThreeObject(link => {
    // extend link with text sprite
    const sprite = new SpriteText(`${link.connection} - ${link.periodicidade}`);
    sprite.color = 'lightgrey';
    sprite.textHeight = 1.5;
    return sprite;
})
.linkPositionUpdate((sprite, { start, end }) => {
    const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
        [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
    })));

    // Position sprite
    Object.assign(sprite.position, middlePos);
})

async function app() {

    var arr = nodes.map((node) => node.id);
    var input = document.getElementById('nsearch');
    var optionsVal = document.getElementById('list');
    
    input.addEventListener('keyup', show);
    optionsVal.onclick = function (e) {
        handleSearchClick(e, this.value)
        setVal(this);
    };
    
    //Use this function to replace potential characters that could break the regex
    RegExp.escape = function (s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    //shows the list
    function show() {
        var dropdown = document.getElementById('dropdown');
        dropdown.style.display = 'none';
        
        optionsVal.options.length = 0;
        
        if (input.value) {
            dropdown.style.display = 'block';
            optionsVal.size = 3;
            var textCountry = input.value;
            
            for (var i = 0; i < arr.length; i++) {
                var testableRegExp = new RegExp(RegExp.escape(textCountry), "i");
                if (arr[i].match(testableRegExp)) {
                    addValue(arr[i], arr[i]);
                    
                }
            }
            
            var size = dropdown.children[0].children;
            if (size.length > 0)
            {
                var defaultSize = 16;
                if (size.length < 10)
                {
                    defaultSize *= size.length;
                }
                else
                {
                    defaultSize *= 10;
                }
                dropdown.children[0].style.height = defaultSize + "px";
            }
            
        }
    }
    
    function addValue(text, val) {
        var createOptions = document.createElement('option');
        optionsVal.appendChild(createOptions);
        createOptions.text = text;
        createOptions.value = val;
    }
    
    //Settin the value in the box by firing the click event
    function setVal(selectedVal) {
        input.value = selectedVal.value;
        document.getElementById('dropdown').style.display = 'none';
    }
}

function handleSearchClick(e, value) {
    e.preventDefault()
    const input = document.getElementById('nsearch');
    const text = value || input.value

    console.log(text)

    const node = Graph.graphData().nodes.filter((node) => node.id === text)

    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node[0].x, node[0].y, node[0].z);
    
    Graph.cameraPosition(
        { x: node[0].x * distRatio, y: node[0].y * distRatio, z: node[0].z * distRatio }, // new position
        node[0], // lookAt ({ x, y, z })
        3000  // ms transition duration
    );
}
app();
})()
