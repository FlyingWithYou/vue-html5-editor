import RangeHandler from './range/handler'
import './style.css'
import template from './editor.html'
/**
 * Created by peak on 2017/2/9.
 */
export default {
    template,
    props: {
        content: {
            type: String,
            required: true,
            default: ''
        },
        height: {
            type: Number,
            default: 300,
            validator(val){
                return val >= 100
            }
        },
        zIndex: {
            type: Number,
            default: 1000
        },
        autoHeight: {
            type: Boolean,
            default: true
        },
        showModuleName: {}
    },
    data(){
        return {
            // defaultShowModuleName:false
            // locale: {},
            // modules:{},
            fullScreen: false,
            showCode: false,
            dashboard: null
        }
    },
    watch: {
        content(val) {
            const content = this.$refs.content.innerHTML
            if (val !== content) {
                this.$refs.content.innerHTML = val
                this.$refs.contentCode.value = val
            }
            this.$emit('update:content', val)
        },
        fullScreen(val){
            const component = this
            if (val) {
                component.parentEl = component.$el.parentNode
                component.nextEl = component.$el.nextSibling
                document.body.appendChild(component.$el)
                return
            }
            if (component.nextEl) {
                component.parentEl.insertBefore(component.$el, component.nextEl)
                return
            }
            component.parentEl.appendChild(component.$el)
        }
    },
    computed: {
        contentStyle(){
            const style = {}
            if (this.fullScreen) {
                style.height = `${window.innerHeight - this.$refs.toolbar.clientHeight - 1}px`
                return style
            }
            if (!this.autoHeight) {
                style.height = `${this.height}px`
                return style
            }
            style['min-height'] = `${this.height}px`
            return style
        }
    },
    methods: {
        toggleFullScreen(){
            this.fullScreen = !this.fullScreen
        },
        enableFullScreen(){
            this.fullScreen = true
        },
        toggleShowCode() {
            this.showCode = !this.showCode
        },
        exitFullScreen(){
            this.fullScreen = false
        },
        focus(){
            this.$refs.content.focus()
        },
        toggleDashboard(dashboard){
            this.dashboard = this.dashboard === dashboard ? null : dashboard
        },
        hiddenDashbord(){
            this.dashboard = null
        },
        execCommand(command, arg){
            this.restoreSelection()
            if (this.range) {
                new RangeHandler(this.range).execCommand(command, arg)
            }
            this.toggleDashboard()
            this.$emit('change', this.$refs.content.innerHTML)
        },
        getCurrentRange(){
            return this.range
        },
        saveCurrentCodeRange() {
           const contentCode = this.$refs.contentCode
           this.range = contentCode.value
           this.$emit('change', contentCode.value)
        },
        saveCurrentRange(){
            const selection = window.getSelection ? window.getSelection() : document.getSelection()
            if (!selection.rangeCount) {
                return
            }
            const content = this.$refs.content
            for (let i = 0; i < selection.rangeCount; i++) {
                const range = selection.getRangeAt(0)
                let start = range.startContainer
                let end = range.endContainer
                // for IE11 : node.contains(textNode) always return false
                start = start.nodeType === Node.TEXT_NODE ? start.parentNode : start
                end = end.nodeType === Node.TEXT_NODE ? end.parentNode : end
                if (content.contains(start) && content.contains(end)) {
                    this.range = range
                    break
                }
            }
            const contentCode = this.$refs.contentCode
            contentCode.value = this.content
        },
        restoreSelection(){
            const selection = window.getSelection ? window.getSelection() : document.getSelection()
            selection.removeAllRanges()
            if (this.range) {
                selection.addRange(this.range)
            } else {
                const content = this.$refs.content
                const div = document.createElement('div')
                const range = document.createRange()
                content.appendChild(div)
                range.setStart(div, 0)
                range.setEnd(div, 0)
                selection.addRange(range)
                this.range = range
            }
        },
        activeModule(module){
            if (module.name !== 'code') {
                this.showCode = false
            }
            if (typeof module.handler === 'function') {
                module.handler(this)
                return
            }
            if (module.hasDashboard) {
                this.toggleDashboard(`dashboard-${module.name}`)
            }
        },
        activeCode(module) {
            if(module.name == 'code' && this.showCode == true) {
                return true;
            } else {
                false;
            }
        }
    },
    created(){
        this.modules.forEach((module) => {
            if (typeof module.init === 'function') {
                module.init(this)
            }
        })
    },
    mounted(){
        const content = this.$refs.content
        content.innerHTML = this.content

        const contentCode = this.$refs.contentCode
        contentCode.value = this.content

        contentCode.addEventListener('keyup', () => {
            this.$emit('change', contentCode.value)
            this.saveCurrentCodeRange()
        })
        contentCode.addEventListener('mouseout', (e) => {
            if (e.target === contentCode) {
                this.saveCurrentCodeRange()
            }
        }, false)
        this.touchCodeHandler = (e) => {
            if (contentCode.contains(e.target)) {
                this.saveCurrentCodeRange()
            }
        }
        window.addEventListener('touchend', this.touchCodeHandler, false)

        content.addEventListener('mouseup', this.saveCurrentRange, false)
        content.addEventListener('keyup', () => {
            this.$emit('change', content.innerHTML)
            this.saveCurrentRange()
        }, false)
        content.addEventListener('mouseout', (e) => {
            if (e.target === content) {
                this.saveCurrentRange()
            }
        }, false)
        this.touchHandler = (e) => {
            if (content.contains(e.target)) {
                this.saveCurrentRange()
            }
        }
        window.addEventListener('touchend', this.touchHandler, false)
    },
    updated(){
        // update dashboard style
        if (this.$refs.dashboard){
            this.$refs.dashboard.style.maxHeight = `${this.$refs.content.clientHeight}px`
        }
    },
    beforeDestroy(){
        window.removeEventListener('touchend', this.touchHandler)
        this.modules.forEach((module) => {
            if (typeof module.destroyed === 'function') {
                module.destroyed(this)
            }
        })
    }
}