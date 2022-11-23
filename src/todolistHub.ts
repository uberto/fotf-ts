// hub is the object facade of the domain with an interface
// hub will have an implementation with DB access and one with only mem for tests

export type Task = { description: string; completed?: boolean }

export type TaskList = { id: string; title: string; tasks: Task[] }

export interface TodolistHub {
  getUserLists: (userName: string) => [TaskList]
  getUserList: (userName: string, listId: string) => TaskList
  //updateListForUser(user, id, list)}
  //newListForUser(user, list)}
}

//stub for tests
export const todolistHubStub: TodolistHub = {
  getUserLists: (userName: string) => {
    return [
      {
        id: "1",
        title: 'A task list',
        tasks: [
          { description: userName + "'s list 1" },
          { description: userName + "'s list 2" },
          { description: userName + "'s list 3" }
        ]
      }
    ]
  },
  getUserList: (userName: string, listId: string) => {
    return {
      id: listId,
      title: userName + "'s list " + listId ,
      tasks: [
        { description: "task 1"},
        { description: "task 2"},
        { description: "task 3"},
      ]
    }
  }
}
