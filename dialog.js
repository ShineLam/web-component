let temp = document.createElement('template')
document.body.appendChild(temp)
temp.innerHTML = `
<div id="mask" class="mask"></div>
<div id="pop" class="pop">
  <div id="cross" class="cross"></div>
  <div id="title" class="title"></div>
  <div id="content" class="content"></div>
  <div><slot></div>
  <div class="pop-btn">
    <div id="cnl" class=""></div>
    <div id="cfm" class=""></div>
  </div>
</div>
`
// 
let style = document.createElement('style')
style.innerText = `
.mask {
  display: none;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 600;
}

.mask.open {
  display: block;
}

.pop {
  visibility: hidden;
  width: 80vw;
  height: auto;
  margin: auto;
  background: #fff;
  border-radius: 6px;
  position: absolute;
  position: fixed;
  left: 0;
  right: 0;
  top: 20vh;
  overflow: hidden;
  transform: scale(0.5, 0.5);
  -webkit-transform: scale(0.5, 0.5);
  transition: all 0.2s ease;
  -webkit-transition: all 0.2s ease;
}

.pop.enter {
  visibility: visible;
  transform: scale(1, 1);
  -webkit-transform: scale(1, 1);
  z-index: 1000;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #060E1F;
  text-align: center;
  padding: 20px ;
}

.cross {
  display: inline-block;
  width: 12px;
  height: 2px;
  font-size: 0;
  background: #999;
  line-height: 0;
  vertical-align: middle;
  -webkit-transform: rotate(45deg);
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

.cross:after {
  content: "/";
  display: block;
  width: 12px;
  height: 2px;
  background: #999;
  -webkit-transform: rotate(-90deg);
}

.content {
  display: none;
  padding: 32px 40px;
  text-align: center;
}

.pop-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #EBEBEB;
}

.pop-btn > div {
  flex: 1;
  text-align: center;
  padding: 20px 0;
  cursor: pointer;
}

.pop-btn > div:first-of-type {
  color: #8D9199;
  border-right: 1px solid #EBEBEB;
}
`

export default class pop extends HTMLElement {

  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(style)
    this._shadowRoot.appendChild(temp.content.cloneNode(true))
    // 
    this.open = false
    //     
    this.$pop = this._shadowRoot.querySelector('#pop')
    this.$mask = this._shadowRoot.querySelector('#mask')
    this.$cross = this._shadowRoot.querySelector('#cross')

    this.init()
    this.initEvt()
  }

  get options() {
    return JSON.parse(this.getAttribute('options'))
  }

  set options(value) {
    this.setAttribute('options', JSON.stringify(value))
  }

  static get observedAttributes() {
    return ['options']
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render()
  }

  setOptions() {
    Object.keys(this.options || {}).forEach(key => {
      let option = this.options[key]
      let fnName = key.substring(0, 1).toUpperCase() + key.substring(1)
      this['set' + fnName](option)
    })
  }

  setTitle(title) {
    this.$title.innerText = title || '提示'
  }

  setContent(content) {
    if (content) {
      this.$content.style.display = 'block'
      this.$content.innerText = content
    }
  }

  setCnl(txt) {
    this.$cnl.innerText = txt || '取消'
  }

  setCfm(txt) {
    this.$cfm.innerText = txt || '确认'
  }

  setOpen(open) {
    this.open = open
    this.show()
  }

  init() {
    let elmNames = ['title', 'content', 'cnl', 'cfm']
    elmNames.forEach(item => {
      let fnName = item.substring(0, 1).toUpperCase() + item.substring(1)
      this['$' + item] = this._shadowRoot.querySelector('#' + item)
      this['set' + fnName]()
    })
  }

  initEvt() {
    this.$mask.addEventListener('click', () => {
      this.hide()
    })
    this.$cross.addEventListener('click', () => {
      this.hide()
    })
    this.$cfm.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('onCfm', {
          detail: '点击了确认按钮',
        })
      )
      this.hide()
    })
    this.$cnl.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('onCnl', {
          detail: '点击了取消按钮',
        })
      )
      this.hide()
    })
  }

  render() {
    this.setOptions()
  }

  show() {
    this.$pop.classList.add("enter")
    this.$mask.classList.add("open")
  }

  hide() {
    this.$pop.classList.remove("enter")
    this.$mask.classList.remove("open")
  }
}

customElements.define('pop-in', pop)
