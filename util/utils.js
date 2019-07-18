const removeTokenField = (sourceArr = []) => {
  sourceArr.map((item, index) => {
    if (item.hasOwnProperty('token')) {
      delete item.token
    }
    return item
  })
}
