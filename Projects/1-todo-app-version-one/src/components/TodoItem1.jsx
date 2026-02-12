function TodoItem1() {

    let todoName = 'Go To Japan';
    let todoDate = '10/02/2026';


    return (<div class="container">
        <div class="row prow">
            <div class="col-6">{todoName}</div>
            <div class="col-4">{todoDate}</div>
            <div class="col-2">
                <button type="button" class="btn btn-danger p-button">Delete</button>
            </div>

        </div>

    </div>
    )

}

export default TodoItem1;