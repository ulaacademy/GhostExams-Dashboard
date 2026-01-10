const status = [
  { value: "active", label: "Active", color: "#17c666" },
  { value: "inactive", label: "Inactive", color: "#ffa21d" },
  { value: "declined", label: "Declined", color: "#ea4d4d" },
];

export const leadTableData = [
  {
    id: 2,
    customer: {
      name: "Nancy Elliot",
      img: "",
    },
    email: "nancy.elliot@outlook.com",
    source: {
      media: "facebook",
      icon: "feather-facebook",
    },
    phone: "(375) 8523 456",
    date: "2023-04-06, 02:52PM",
    status: { status, defaultSelect: "active" },
  },
];
