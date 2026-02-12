import AddTodo from "./components/AddTodo";
import AppName from "./components/AppName"

function App() {


  return <center class='todo-container'>
    <AppName></AppName>

    <AddTodo />




    <div class="row">
      <div class="col-6">
        Study DSA
      </div>
      <div class="col-4">
        25/10/2000
      </div>
      <div class="col-2">
        <button type="button" class="btn btn-danger">Delete</button>
      </div>

    </div>


    <div class="row">
      <div class="col-6">
        Study SQL
      </div>
      <div class="col-4">
        11/02/2026
      </div>
      <div class="col-2">
        <button type="button" class="btn btn-danger">Delete</button>
      </div>

    </div>

  </center>
}

export default App;
