import Vue from 'vue'
import {
  Button,
  Input,
  Icon,
  TabPane,
  Tabs,
  Table,
  CheckboxGroup,
  Checkbox,
  Select,
  Option,
  Modal,
  Menu,
  MenuGroup,
  MenuItem,
  Row,
  Col,
  Page,
  Switch,
  Tree
} from 'iview'

// iview基础模块
const components = {
  Button,
  Input,
  Icon,
  TabPane,
  Tabs,
  Table,
  CheckboxGroup,
  Checkbox,
  Select,
  Option,
  Modal,
  Menu,
  MenuGroup,
  MenuItem,
  Row,
  Col,
  Page,
  'i-switch': Switch,
  Tree
}
const iviewModule = {
  ...components
}


Object.keys(iviewModule).forEach(key => {
  Vue.component(key, iviewModule[key])
})

import 'iview/dist/styles/iview.css'
