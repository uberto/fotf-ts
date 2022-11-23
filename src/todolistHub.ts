// const myRoutes = (hub) => routing([
//   "/:user/lists" GET { hub.allListsForUser(u)},
//   "/:user/list/:id" GET { hub.getListForUser(u, id)}
//   "/:user/list/:id" PUT { hub.updateListForUser(u, id, list)}
//   "/:user/list" POST { hub.newListForUser(u, list)}
// ])
type Task = { description: string; completed?: boolean }
type TaskList = { id: number; title: string; tasks: Task[] }
interface TodolistHub {
  getUserLists: (userName: string) => [TaskList]
  getUserList: (userName: string, listId: number) => TaskList
}
const todolistHub: TodolistHub = {
  getUserLists: (userName: string) => {
    return [
      {
        id: 1,
        title: 'A task list',
        tasks: [
          { description: userName + "'s list 1" },
          { description: userName + "'s list 2" },
          { description: userName + "'s list 3" }
        ]
      }
    ]
  },
  getUserList: (userName: string, listId: number) => {
    return {
      id: listId,
      title: 'A task list',
      tasks: [
        { description: userName + "'s list 1" },
        { description: userName + "'s list 2" },
        { description: userName + "'s list 3" }
      ]
    }
  }
}
