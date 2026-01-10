import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Table from '@/components/shared/table/Table'
import { FiTrash2, FiSlash, FiUserCheck, FiEye } from 'react-icons/fi'
import { confirmDelete } from '@/utils/confirmDelete'
import topTost from '@/utils/topTost'
import {
    banStudentById,
    banTeacherById,
    deleteStudentById,
    deleteTeacherById,
    fetchStudentsList,
    fetchTeachersList,
    selectStudents,
    selectStudentsLoading,
    selectTeachers,
    selectTeachersLoading,
} from '@/store/usersSlice'

const Tabs = ({ active, onChange }) => {
    return (
        <div className="d-flex gap-2 mb-3">
            <button
                className={`btn btn-sm ${active === 'students' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => onChange('students')}
            >
                Students
            </button>
            <button
                className={`btn btn-sm ${active === 'teachers' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => onChange('teachers')}
            >
                Teachers
            </button>
        </div>
    )
}

const UsersManagementTable = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('students')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState('')

    const students = useSelector(selectStudents)
    const teachers = useSelector(selectTeachers)
    const loadingStudents = useSelector(selectStudentsLoading)
    const loadingTeachers = useSelector(selectTeachersLoading)

    useEffect(() => {
        const params = { page, limit, search: search.trim() || undefined }
        if (activeTab === 'students') {
            dispatch(fetchStudentsList(params))
        } else {
            dispatch(fetchTeachersList(params))
        }
    }, [activeTab, page, limit, search, dispatch])

    const data = activeTab === 'students' ? students : teachers
    const loading = activeTab === 'students' ? loadingStudents : loadingTeachers
    const total = useSelector((state) => activeTab === 'students' ? state.users.students.total : state.users.teachers.total)

    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'name',
                header: () => 'Name',
                cell: (info) => <span className="text-truncate-1-line">{info.getValue()}</span>,
            },
            {
                accessorKey: 'email',
                header: () => 'Email',
                cell: (info) => <a href={`mailto:${info.getValue()}`}>{info.getValue()}</a>,
            },

            // ✅ NEW: Phone column
            {
                accessorKey: 'phone',
                header: () => 'Phone',
                cell: ({ row }) => {
                    const entity = row.original
                    const phone =
                        entity?.phone ||
                        entity?.phoneNumber ||
                        entity?.mobile ||
                        entity?.contactPhone ||
                        ''

                    return phone ? (
                        <span dir="ltr">{phone}</span>
                    ) : (
                        <span className="text-muted">-</span>
                    )
                },
            },

            {
                accessorKey: 'isBanned',
                header: () => 'Status',
                cell: (info) => (
                    <span className={`badge ${info.getValue() ? 'bg-danger' : 'bg-success'}`}>
                        {info.getValue() ? 'Banned' : 'Active'}
                    </span>
                ),
            },
            {
                accessorKey: 'actions',
                header: () => 'Actions',
                cell: ({ row }) => {
                    const entity = row.original
                    const isBanned = !!entity.isBanned
                    const onToggleBan = () => {
                        if (activeTab === 'students') {
                            dispatch(banStudentById({ studentId: entity.id, isBanned: !isBanned }))
                        } else {
                            dispatch(banTeacherById({ teacherId: entity.id, isBanned: !isBanned }))
                        }
                    }
                    const onDelete = async () => {
  const res = await confirmDelete(entity.id)
  if (!res?.confirmed) return

  try {
    let actionResult

    if (activeTab === 'students') {
      actionResult = await dispatch(deleteStudentById(entity.id))
    } else {
      actionResult = await dispatch(deleteTeacherById(entity.id))
    }

    // ✅ لا تعمل toast ولا تحدث القائمة إلا إذا نجح فعلاً
    if (actionResult?.meta?.requestStatus === "fulfilled") {
      topTost("✅ تم الحذف بنجاح")

      // ✅ (مهم) أعد تحميل القائمة من السيرفر لتتأكد أنها انحذفت فعلياً
      const params = { page, limit, search: search.trim() || undefined }
      if (activeTab === 'students') {
        dispatch(fetchStudentsList(params))
      } else {
        dispatch(fetchTeachersList(params))
      }
    } else {
      const msg =
        actionResult?.payload?.message ||
        actionResult?.error?.message ||
        "❌ فشل الحذف"
      topTost(msg)
    }
  } catch {
    topTost("❌ فشل الحذف")
  }
}

                    return (
                        <div className="hstack gap-2">
                            <button
                                className="btn btn-xs btn-info"
                                onClick={() => navigate(activeTab === 'students' ? `/student/${entity.id}` : `/teacher/${entity.id}`)}
                            >
                                <FiEye /> View
                            </button>
                            <button className={`btn btn-xs ${isBanned ? 'btn-success' : 'btn-warning'}`} onClick={onToggleBan}>
                                {isBanned ? <FiUserCheck /> : <FiSlash />} {isBanned ? 'Unban' : 'Ban'}
                            </button>
                            <button className="btn btn-xs btn-outline-danger" onClick={onDelete}>
                                <FiTrash2 /> Delete
                            </button>
                        </div>
                    )
                },
                meta: { headerClassName: 'text-end', className: 'text-end' },
            },
        ]
    }, [activeTab, dispatch, navigate])

    return (
        <div className="col-lg-12">
            <div className="card stretch stretch-full">
                <div className="card-body">
                    <Tabs active={activeTab} onChange={(tab) => { setActiveTab(tab); setPage(1); }} />
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            style={{ maxWidth: 260 }}
                            placeholder="Search name or email..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                        <select
                            className="form-select form-select-sm"
                            style={{ maxWidth: 120 }}
                            value={limit}
                            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        >
                            <option value={10}>10 / page</option>
                            <option value={20}>20 / page</option>
                            <option value={50}>50 / page</option>
                        </select>
                    </div>
                    <div style={{ maxHeight: '600px', overflowY: 'auto', overflowX: 'auto' }}>
                        {loading ? (
                            <div className="py-4 text-center">Loading...</div>
                        ) : (
                            <Table data={data} columns={columns} showSearch={false} showPagination={false} />
                        )}
                    </div>
                    {!loading && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                Prev
                            </button>
                            <div className="small text-muted">Page {page} ({data.length} of {total} items)</div>
                            <button className="btn btn-sm btn-outline-secondary" disabled={data.length < limit || (total && page * limit >= total)} onClick={() => setPage((p) => p + 1)}>
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UsersManagementTable
