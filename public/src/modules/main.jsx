import React from 'react'
import Footer from '../components/footer'
import AddTodo from '../containers/add-to-do'
import VisibleTodoList from '../containers/visible-to-do-list'

const Main = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default Main