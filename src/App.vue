<template>
  <div id="app">
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="15">
            <el-row>
              <el-col :span="5">
                <el-input placeholder="条数" v-model="size"></el-input>
              </el-col>
              <el-col :span="5">
                <el-input placeholder="从第几条开始" v-model="from"></el-input>
              </el-col>
            </el-row>
            <Conditions :value="conditions" />

            <div class="grid-content bg-purple">
              <codemirror :value="code" :options="codeOptions"></codemirror>
            </div>

          </el-col>
          <el-col :span="9">
            <codemirror :value="result" :options="resultOptions"></codemirror>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // language
  import 'codemirror/mode/javascript/javascript.js'
  // theme css
  import 'codemirror/theme/monokai.css'
  // require active-line.js
  import'codemirror/addon/selection/active-line.js'
  // styleSelectedText
  import'codemirror/addon/selection/mark-selection.js'
  import'codemirror/addon/search/searchcursor.js'
  // hint
  import'codemirror/addon/hint/show-hint.js'
  import'codemirror/addon/hint/show-hint.css'
  import'codemirror/addon/hint/javascript-hint.js'
  import'codemirror/addon/selection/active-line.js'
  // highlightSelectionMatches
  import'codemirror/addon/scroll/annotatescrollbar.js'
  import'codemirror/addon/search/matchesonscrollbar.js'
  import'codemirror/addon/search/searchcursor.js'
  import'codemirror/addon/search/match-highlighter.js'
  // keyMap
  import'codemirror/mode/clike/clike.js'
  import'codemirror/addon/edit/matchbrackets.js'
  import'codemirror/addon/comment/comment.js'
  import'codemirror/addon/dialog/dialog.js'
  import'codemirror/addon/dialog/dialog.css'
  import'codemirror/addon/search/searchcursor.js'
  import'codemirror/addon/search/search.js'
  import'codemirror/keymap/sublime.js'
  // foldGutter
  import'codemirror/addon/fold/foldgutter.css'
  import'codemirror/addon/fold/brace-fold.js'
  import'codemirror/addon/fold/comment-fold.js'
  import'codemirror/addon/fold/foldcode.js'
  import'codemirror/addon/fold/foldgutter.js'
  import'codemirror/addon/fold/indent-fold.js'
  import'codemirror/addon/fold/markdown-fold.js'
  import'codemirror/addon/fold/xml-fold.js'
  import OneCondition from "~/components/OneCondition";
  import Conditions from "~/components/Conditions";

  var bodybuilder = require('bodybuilder');

export default {
  components: {Conditions},
  methods: {
    startHacking () {
      this.$notify({
        title: 'It works!',
        type: 'success',
        message: 'We\'ve laid the ground work for you. It\'s time for you to build something epic!',
        duration: 5000
      })
    }
  },
  data() {
    return {
      size: '',
      from: '',
      conditions: [],
      codeOptions: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        foldGutter: true,
        styleSelectedText: true,
        mode: 'text/javascript',
        keyMap: "sublime",
        matchBrackets: true,
        showCursorWhenSelecting: true,
        extraKeys: { "Ctrl": "autocomplete" },
        hintOptions:{
          completeSingle: false
        }
      },
      resultOptions: {
        theme: "monokai",
        lineNumbers: true,
        mode:"application/json",
        readOnly: true
      }
    }
  },
  computed: {
    result() {
      let ret = '';
      try {
        ret = eval(this.code);
        if (typeof ret === 'object') {
          ret = JSON.stringify(ret, null, "\t");
        } else {
          ret = ret + '';
        }
      } catch (e) {}
      return ret;
    },

    code: {
      get() {
        let code = 'bodybuilder()\n';
        if (this.size && !isNaN(this.size)) {
          code += '        .size(' + this.size + ')\n';
        }
        if (this.from && !isNaN(this.from)) {
          code += '        .from(' + this.from + ')\n';
        }
        this.conditions.forEach(c => {
          code += '        .' + c.exp + '\n';
        });
        code += '        .build()';
        return code;
      }

    }
  },

  beforeMount() {
  },

  beforeUpdate() {
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.CodeMirror {
  border: 1px solid #eee;
  height: auto;
}


.el-input, .el-select {
  width: 100%;
}
.el-col {
  padding-right: 5px;
}
</style>
