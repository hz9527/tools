class Option {
  constructor(name, args) {
    this.name = name
    this.users = {}
    this.args = args
  }

  addUser(type, user) {
    if (!this.users[type]) {
      this.users[type] = []
    }
    this.users[type].push(user)
  }
}

class Registor {
  constructor(types = []) {
    this.types = types.reduce((res, key) => {
      res[key] = []
      return res
    }, {})
    this.options = {}
  }

  addOption(name, args) {
    this.options[name] = new Option(name, args)
  }
  /**
   * 
   * @param {{type: string, name: string, beforeExec: (...opts: any[]) => string | void, exec: ()rewrite?: boolean}} config 
   */
  register(config) {
  }
}