/**
 * header
 * Created by hansin on 16/8/20.
 */
export default {
    name: 'font-header',
    icon: 'fa fa-header',
    i18n: 'font size',
    handler(editor) {
      // editor.execCommand('heading')
    },
    execType: 'fontSize',
    selectList: [{
      label: '10px',
      value: '10px' // 2 对应 h2标签
    }, {
      label: '11px',
      value: '11px'
    }, {
      label: '12px',
      value: '12px'
    }, {
      label: '13px',
      value: '13px'
    }, {
      label: '14px',
      value: '14px'
    }, {
      label: '16px',
      value: '16px'
    }, {
      label: '18px',
      value: '18px'
    }, {
      label: '20px',
      value: '20px'
    }, {
      label: '24px',
      value: '24px'
    }, {
      label: '36px',
      value: '36px'
    }, {
      label: '48px',
      value: '48px'
    }]
}
