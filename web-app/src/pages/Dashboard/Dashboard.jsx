import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import { toast } from 'react-toastify'
import { API_ROOT } from '../../utils/constants' 
import authorizedAxiosInstance from '../../utils/authorizedAxios' 
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { handleLogoutAPI } from '../../apis'

function Dashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authorizedAxiosInstance.get(`${API_ROOT}/ecommerce/users`)
        setUsers(res.data.result || [])
      } catch (error) {
        toast.error('Không thể tải danh sách người dùng.')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = async () => {  
    await handleLogoutAPI()
  
    navigate('/login')
  }
  

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Đang tải dữ liệu người dùng...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{
      maxWidth: '1120px',
      marginTop: '1em',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '0 1em'
    }}>
      <Alert severity="info">
        Đây là trang Dashboard hiển thị danh sách người dùng từ hệ thống.
      </Alert>

      <Divider sx={{ my: 2 }} />

      {users.length === 0 ? (
        <Typography>Không có người dùng nào.</Typography>
      ) : (
        users.map((user) => (
          <Paper key={user.id} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">Username: {user.username}</Typography>
            <Typography>Role: {user.roles?.[0]?.name || 'Không có role'}</Typography>
            <Typography>Họ và tên: {user.firstName || '---'} {user.lastName || ''}</Typography>
            <Typography>Địa chỉ: {user.address || '---'}</Typography>
            <Typography>Ngày sinh: {user.dob || '---'}</Typography>
          </Paper>
        ))
      )}


      <Button
        type='button'
        variant='contained'
        color='info'
        size='large'
        sx={{mt: 2, maxWidth: 'min-content', alignSelf: 'flex-end'}}
        onClick={handleLogout}  
      >
        Logout
      </Button>
    </Box>
  )
}

export default Dashboard
