/**
 * editor info
 * Created by peak on 16/8/18.
 */
// import dashboard from './dashboard'

export default {
    name: 'code',
    icon: 'fa fa-file-code-o ',
    i18n: 'code',
    handler (editor) {
        editor.toggleShowCode();
        // console.log(editor.content, 'code', editor);
    }
    // init (editor) {
    //
    // },
    // destroyed(editor){
    //
    // },
    // dashboard
}
