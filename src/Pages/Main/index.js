import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Container from '../../Components/Container';
import api from '../../services/api';
import { Form, List, SubmitButton } from './styles';

export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newRepo: '',
            repositories: [],
            loading: false,
            isValid: true,
        };
    }

    componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            this.setState({
                repositories: JSON.parse(localStorage.getItem('repositories')),
            });
        }
    }

    componentDidUpdate(_, prev) {
        const { repositories, isValid } = this.state;

        if (repositories !== prev.repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value });
    };

    handleSubmit = async e => {
        e.preventDefault();
        try {
            this.setState({ loading: true });

            const { newRepo, repositories } = this.state;

            repositories.forEach(r => {
                if (r.name.toUpperCase() === newRepo.toUpperCase()) {
                    throw new Error('Repositório Duplicado');
                }
            });

            const response = await api.get(`/repos/${newRepo}`);

            const data = {
                name: response.data.full_name,
            };

            this.setState({
                repositories: [...repositories, data],
                newRepo: '',
                loading: false,
                isValid: true,
            });
        } catch (err) {
            this.setState({
                isValid: false,
                loading: false,
            });
        }
    };

    render() {
        const { newRepo, repositories, loading, isValid } = this.state;
        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>
                <Form onSubmit={this.handleSubmit} isValid={isValid}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading}>
                        {loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaPlus color="#FFFFFF" size={14} />
                        )}
                    </SubmitButton>
                </Form>
                <List>
                    {repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link
                                to={`/repository/${encodeURIComponent(
                                    repository.name
                                )}`}
                            >
                                Detalhes
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
