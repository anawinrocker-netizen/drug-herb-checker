// Map Firebase Auth error codes to friendly Thai messages.
const MESSAGES = {
  'auth/email-already-in-use': 'อีเมลนี้ถูกใช้งานแล้ว',
  'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
  'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/wrong-password': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/user-not-found': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/weak-password': 'รหัสผ่านสั้นเกินไป (อย่างน้อย 6 ตัว)',
  'auth/missing-password': 'กรุณากรอกรหัสผ่าน',
  'auth/user-disabled': 'บัญชีนี้ถูกระงับการใช้งาน',
  'auth/too-many-requests': 'พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณาลองใหม่ภายหลัง',
  'auth/network-request-failed': 'เชื่อมต่อเครือข่ายไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ต',
  'auth/popup-closed-by-user': 'คุณปิดหน้าต่างเข้าสู่ระบบด้วย Google ก่อนดำเนินการเสร็จ',
  'auth/popup-blocked': 'เบราว์เซอร์บล็อกหน้าต่างเข้าสู่ระบบ กรุณาอนุญาต pop-up แล้วลองใหม่',
  'auth/cancelled-popup-request': 'มีการเปิดหน้าต่างเข้าสู่ระบบซ้อนกัน กรุณาลองใหม่',
}

export function authErrorMessage(error) {
  const code = error?.code
  return MESSAGES[code] || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
}
