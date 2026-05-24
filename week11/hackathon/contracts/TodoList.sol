// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TodoList {
    struct Task {
        uint256 id;
        string content;
        bool completed;
        uint256 timestamp;
        address owner;
        string category;
        uint8 priority; // 1=Low, 2=Medium, 3=High
    }

    uint256 private _taskIdCounter;

    mapping(uint256 => Task) public tasks;
    mapping(address => uint256[]) private _userTaskIds;

    event TaskCreated(uint256 indexed id, address indexed owner, string content, uint256 timestamp);
    event TaskStatusToggled(uint256 indexed id, bool completed);
    event TaskDeleted(uint256 indexed id);
    event TaskEdited(uint256 indexed id, string newContent);

    modifier onlyTaskOwner(uint256 _id) {
        require(tasks[_id].id == _id, "Task does not exist");
        require(tasks[_id].owner == msg.sender, "Not authorized");
        _;
    }

    function createTask(string memory _content, string memory _category, uint8 _priority) public {
        require(bytes(_content).length > 0, "Task content cannot be empty");
        
        _taskIdCounter++;
        uint256 newTaskId = _taskIdCounter;

        tasks[newTaskId] = Task({
            id: newTaskId,
            content: _content,
            completed: false,
            timestamp: block.timestamp,
            owner: msg.sender,
            category: _category,
            priority: _priority
        });

        _userTaskIds[msg.sender].push(newTaskId);

        emit TaskCreated(newTaskId, msg.sender, _content, block.timestamp);
    }

    function toggleTaskCompletion(uint256 _id) public onlyTaskOwner(_id) {
        Task storage task = tasks[_id];
        task.completed = !task.completed;
        emit TaskStatusToggled(_id, task.completed);
    }

    function getMyTasks() public view returns (Task[] memory) {
        uint256[] memory myTaskIds = _userTaskIds[msg.sender];
        uint256 count = 0;
        
        for (uint256 i = 0; i < myTaskIds.length; i++) {
            if (tasks[myTaskIds[i]].id != 0) {
                count++;
            }
        }

        Task[] memory myTasks = new Task[](count);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < myTaskIds.length; i++) {
            uint256 taskId = myTaskIds[i];
            if (tasks[taskId].id != 0) {
                myTasks[currentIndex] = tasks[taskId];
                currentIndex++;
            }
        }
        
        return myTasks;
    }

    function getTask(uint256 _id) public view returns (Task memory) {
        require(tasks[_id].id == _id, "Task does not exist");
        return tasks[_id];
    }

    function editTask(uint256 _id, string memory _newContent) public onlyTaskOwner(_id) {
        require(bytes(_newContent).length > 0, "Task content cannot be empty");
        tasks[_id].content = _newContent;
        emit TaskEdited(_id, _newContent);
    }

    function deleteTask(uint256 _id) public onlyTaskOwner(_id) {
        delete tasks[_id];
        emit TaskDeleted(_id);
    }
}
