const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.user_id,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
export default getters
