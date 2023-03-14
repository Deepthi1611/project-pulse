
# PROJECT PULSE



## Description

This product will serve as tracking tool for projects and portfolio for each GDO and overall organisation. This project contains mere backend development of the product.
## Installation

You can clone the github project in your local repository for further implementation using the below command:

```bash
  git clone https://github.com/Deepthi1611/project-pulse
```

You can also download the zip file of this project and extract the files.

If you download manually, you can use the below command to install all modules that are used in this project

```bash
  npm install
```

After the installation of modules, you can start the server using the below command:

```bash
  npm start
```



    
## Configurations

Create a database for this project and create employees table in that database with attributes empId of integer type and empName of string type. Here we considered existing employee details in the table.

Create ```.env``` file and add the following details to your ```.env``` file

```
DB_NAME=name of your database

DB_USER=your username

DB_PASSWORD=your password

PORT=your port number

SECRET_KEY=your secret key

EMAIL=your email

EMAIL_PASSWORD=your email password(App password)

EMAIL_SERVICE_PROVIDER=email service provider name(example: gmail)
```
## Overview

### Roles in the project

```
1.SuperAdmin
2.Admin
3.GDO Head(Global Delivery Organization Head)
4.Project Manager
5.HR Manager
```

### Tasks performed by various Roles

#### Super Admin

```
 1.Get all the employees whose role is not assigned.
 2.Assign roles to the Employees.
```

#### Admin

```
 1.Get all the projects in an organization
 2.Get details of a specific project (Detailed overview,project concerns, project updates and team Composition)
 3.Create a project
 4.Update the existing project
 5.Delete existing project
```

#### GDO Head

```
 1.Get all projects under him
 2.Get details od specific project (Detailed overview,project concerns, project updates and team Composition)
 3.Add existing employees to project(creating team for a project)
 4.Update employee details in a team
 5.Delete employee details in a team
 6.Raising Resource requests
```

#### Project Manager

```
 1.Get project details under him
 2.updates project details
 3.raises project concerns
 4.update project updates
 5.delete project updates
 6.update project concerns
 7.delete project concerns 
```
