import template from './dashboard.html'

/**
 * Created by peak on 2017/2/10.
 */
export default {
    template,
    data(){
        return {
            rows: 0,
            cols: 0,
            hasHead: false,
            striped: false,
            hover: false
        }
    },
    methods: {
      hoverTd (x, y) {
        this.rows = y + 1
        this.cols = x + 1
      },
      insertTable(){
          let table = '<table width="100%" style="border-spacing: 0px; border-collapse: collapse; margin-bottom: 0px; border: 1px solid rgb(221, 221, 221); color: rgb(51, 51, 51); font-size: 14px; line-height: 20px; background-color: transparent; width: 100%;"><tbody>'
          for (let i = 0; i < this.rows; i++) {
              table += '<tr>'
              for (let j = 0; j < this.cols; j++) {
                  table += '<td style="padding: 8px; line-height: 1.42857; vertical-align: top; border: 1px solid rgb(221, 221, 221);">&nbsp;</td>'
              }
              table += '</tr>'
          }
          table += '</tbody></table>'
          this.$parent.execCommand('insertHTML', table)
      }
    }
}