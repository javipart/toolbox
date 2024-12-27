/* eslint-disable */
let expect
let sinon;

(async () => {
  const chai = await import('chai')
  expect = chai.expect
  sinon = (await import('sinon')).default
})()
const axios = require('axios')
const express = require('express')
const request = require('supertest')
const fileRoutes = require('../../routes/file.routes')
const fileController = require('../../controllers/file.controller')
const MockAdapter = require('axios-mock-adapter')

describe('File Routes Tests', function () {
  let app

  before(async function () {
    const chai = await import('chai')
    expect = chai.expect
    sinon = (await import('sinon')).default
  })

  beforeEach(function () {
    app = express()
    app.use(express.json())
    app.use('/files', fileRoutes)
    mock = new MockAdapter(axios)
    sinon.restore()
  })

  afterEach(function () {
    sinon.restore()
  })

  it('should call getFileData on GET /files/data', async function () {
    sinon.stub(fileController, 'getFileData').callsFake((req, res) =>
      res.status(200).json({ message: 'mocked data response' })
    )

    mock.onGet(`${process.env.EXTERNAL_API}/files`).reply(200, {
      files: ['file1.csv', 'file2.csv']
    })

    mock.onGet(`${process.env.EXTERNAL_API}/file/file1.csv`).reply(200, 'file content')
    mock.onGet(`${process.env.EXTERNAL_API}/file/file2.csv`).reply(200, 'file content')

    const response = await request(app).get('/files/data')

    expect(response.status).to.equal(200)
    expect(response.body).to.be.an('array')
  })

  it('should call getFileList on GET /files/list', async function () {
    sinon.stub(fileController, 'getFileList').callsFake((req, res) =>
      res.status(200).json({ message: 'mocked list response' })
    )

    mock.onGet(`${process.env.EXTERNAL_API}/files`).reply(200, {
      files: ['file1.csv', 'file2.csv']
    })

    const response = await request(app).get('/files/list')

    expect(response.status).to.equal(200)
    console.log(response.body)
    expect(response.body).to.be.an('array')
  })

  it('should return 404 for an unknown route', async function () {
    const response = await request(app).get('/files/unknown')

    expect(response.status).to.equal(404)
  })
})
