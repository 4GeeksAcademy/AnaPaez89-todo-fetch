import React, { useEffect, useState } from "react";

const Home = () => {

	const [tasks, setTasks] = useState([]);
	const [user, setUser] = useState('anapaez');
	const [input, setInput] = useState("");
	const addTask = (e) => {
		if (e.key === 'Enter' && input) {
			createTask(input);
		}
	};
	const handleEdit = (e, taskId) => {
		if (e.key === 'Enter' && editInput) {
			updateTask(taskId, editInput);
		}
	};
	const [editingTaskId, setEditingTaskId] = useState(null); 
	const [editInput, setEditInput] = useState("");

	function getTasks() {

		fetch(`https://playground.4geeks.com/todo/users/${user}`)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else if (response.status === 404) {
					createUser();
					return getTasks();
				} else {
					throw new Error('Error')
				}
			})


			.then(data => {
				if (Array.isArray(data.todos)) {
					setTasks(data.todos);
				} else {
					setTasks([]);
				}
			})
			.catch(error => console.log(error));
	}

	function createUser() {
		fetch(`https://playground.4geeks.com/todo/todos/${user}`, { method: 'POST' })
			.then(response => response.json())
			.then(data => {

			})
			.catch(error => {
				console.error('Error creating user:', error);
			});
	}

	function updateTask(id, updatedLabel) {
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				"label": updatedLabel,
				"is_done": false
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(data => {
				if (data) {
					setEditingTaskId(null);
					getTasks();
				}
			})
			.catch(error => {
				console.error('Error updating task:', error);
			});
	}

	useEffect(() => {
		createUser();
		getTasks();
	}, []);

	function createTask(task) {
		fetch(`https://playground.4geeks.com/todo/todos/${user}`, {
			method: 'POST',
			body: JSON.stringify({
				"label": task,
				"is_done": false
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(data => {
				if (data) {
					setInput('');
					getTasks();
				}
			})
			.catch(error => {
				console.error('Error creating task:', error);
			});
	}

	function deleteTask(id) {
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, { method: 'DELETE' })

			.then(response => {
				if (response.ok) {
					getTasks();
				} else {
					response.json().then(data => {
						console.error('Error deleting task:', data);
					});
				}
			})
			.catch(error => {
				console.error('Error deleting task:', error);
			});
	}

	return (
		<div className="container d-flex  align-items-center my-5 flex-column">
			<h1 className="text-center my-4">To Do List</h1>

			<div className="card w-75 p-3 mb-5 rounded">
				<div className="card-body">
					<input
						type="text"
						className="form-control mb-3"
						placeholder="Agregar aquí tareas"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={addTask}
					/>
					<ul className="list-group">
						{tasks.length === 0 ? (
							<li className="list-group-item text-center text-muted">
								No tienes tareas, agrega alguna
							</li>
						) : (
							tasks.map((task) => (
								<li
									key={task.id}
									className="list-group-item d-flex justify-content-between align-items-center"
								>
									{editingTaskId === task.id ? (
										<input
											type="text"
											value={editInput}
											onChange={(e) => setEditInput(e.target.value)}
											onKeyDown={(e) => handleEdit(e, task.id)}
											className="form-control"
										/>
									) : (
										<>
											{task.label}
											<div className="d-flex">
												<span
													className="editText mx-2"
													onClick={() => {
														setEditingTaskId(task.id);
														setEditInput(task.label);
													}}
												>
													<i class="fas fa-edit"></i>
												</span>
												<span
													className="deleteText mx-2"
													onClick={() => deleteTask(task.id)}
												>
													<i class="fas fa-trash-alt"></i>
												</span>
											</div>
										</>
									)}
								</li>
							))
						)}
					</ul>
					<div className="mt-3 text-muted">
						{tasks.length} tareas pendiente{tasks.length !== 1 ? 's' : ''}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
